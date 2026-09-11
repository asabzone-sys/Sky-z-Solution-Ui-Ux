const url = 'https://sky-z-solution-ui-ux.vercel.app';
const API = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

const SKIP = new Set([
  'metrics', 'performance-budget', 'user-timings', 'diagnostics',
  'mainthread-work-breakdown', 'bootup-time', 'network-requests',
  'network-rtt', 'network-server-latency', 'resource-summary',
  'screenshot-thumbnails', 'final-screenshot', 'full-page-screenshot',
  'metrics-end-to-end', 'script-treemap-data'
]);

async function run(strategy) {
  const api = `${API}?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;
  const res = await fetch(api);
  const json = await res.json();
  if (json.error) {
    console.log(`\n=== ${strategy} ERROR ===`);
    console.log(JSON.stringify(json.error).slice(0, 500));
    return;
  }
  const lr = json.lighthouseResult;
  console.log(`\n=== ${strategy.toUpperCase()} ===  (lighthouse ${lr.lighthouseVersion}, ${lr.fetchTime})`);
  for (const [k, v] of Object.entries(lr.categories)) {
    console.log(`  ${k}: ${v.score === null ? 'n/a' : Math.round(v.score * 100)}`);
  }
  const audits = lr.audits;
  const seen = new Set();
  const lines = [];
  for (const cat of Object.values(lr.categories)) {
    for (const ref of cat.auditRefs || []) {
      const a = audits[ref.id];
      if (!a || a.score === null || a.score >= 1 || SKIP.has(ref.id)) continue;
      if (seen.has(ref.id)) continue;
      seen.add(ref.id);
      lines.push(`\n[${ref.id}] score=${a.score} | ${a.title}${a.displayValue ? ' — ' + a.displayValue : ''}`);
      const items = (a.details && a.details.items) || [];
      for (const it of items.slice(0, 8)) {
        const node = it.node || it;
        const label = node.selector || node.source || it.url || '';
        const snippet = (node.explanation || node.snippet || it.subItems ? JSON.stringify(it).replace(/\s+/g, ' ') : '').slice(0, 300);
        lines.push(`   - ${label} ${snippet}`);
      }
      if (items.length > 8) lines.push(`   ...and ${items.length - 8} more`);
    }
  }
  if (!lines.length) console.log('  No failing audits.');
  console.log(lines.join('\n'));
}

(async () => {
  await Promise.all([run('mobile'), run('desktop')]);
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
