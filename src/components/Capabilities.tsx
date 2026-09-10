import React from 'react';
import { Laptop, Bot, TrendingUp, ArrowRight, Code, Activity, Database, RefreshCw, Cloud } from 'lucide-react';
import { CAPABILITIES } from '../data/content';
import { useNavigation } from '../context/NavigationContext';

export const Capabilities: React.FC = () => {
  const { navigate } = useNavigation();
  const buildCap = CAPABILITIES.find((c) => c.category === 'BUILD')!;
  const growCap = CAPABILITIES.find((c) => c.category === 'GROW')!;
  const automateCap = CAPABILITIES.find((c) => c.category === 'AUTOMATE')!;

  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-skyz-bg border-t border-skyz-border transition-colors duration-200 relative z-10" id="services">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-skyz-surface mb-3 border border-skyz-border shadow-sm">
              <span className="text-xs text-skyz-text-muted uppercase tracking-wider font-semibold">
                02 // Core Capabilities
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-skyz-text tracking-tight font-bold">
              Build. Grow. Automate.
            </h2>
            <p className="text-base sm:text-lg text-skyz-text-muted mt-3 leading-relaxed">
              The three core pillars of SkyZ Solutions: engineering resilient digital products, accelerating market reach, and orchestrating autonomous workflows.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('services')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-skyz-text hover:text-skyz-accent transition-colors self-start md:self-auto cursor-pointer"
          >
            <span>View All 23 Capabilities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3-Pillar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Card 1: 01 // BUILD */}
          <div className="rounded-3xl bg-skyz-surface p-6 sm:p-8 relative overflow-hidden group hover:shadow-xl border border-skyz-border transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-skyz-surface-subtle shadow-sm flex items-center justify-center text-skyz-accent border border-skyz-border group-hover:scale-105 transition-transform">
                  <Laptop className="w-6 h-6 text-skyz-accent" />
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-skyz-surface-subtle border border-skyz-border text-skyz-text uppercase font-bold tracking-wider">
                  01 // BUILD
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl text-skyz-text font-bold">
                {buildCap.title}
              </h3>
              <p className="text-sm sm:text-base text-skyz-text-muted mt-2">
                {buildCap.description}
              </p>
            </div>

            {/* Interactive Visual Widget */}
            <div className="my-6 p-4 rounded-2xl bg-skyz-surface-subtle shadow-sm border border-skyz-border">
              <div className="flex items-center justify-between relative overflow-hidden">
                <div className="flex flex-col items-center gap-1 z-10">
                  <div className="w-10 h-10 rounded-full bg-skyz-surface border border-skyz-border flex items-center justify-center text-skyz-text font-semibold text-xs shadow-sm">
                    UI/UX
                  </div>
                  <span className="text-[11px] text-skyz-text-muted">Architecture</span>
                </div>
                <div className="flex-1 h-1 bg-skyz-border mx-2 relative rounded-full overflow-hidden">
                  <div className="absolute h-full w-12 bg-skyz-accent rounded-full animate-signal-pulse" />
                </div>
                <div className="flex flex-col items-center gap-1 z-10">
                  <div className="w-11 h-11 rounded-full bg-skyz-text dark:bg-skyz-accent text-skyz-bg dark:text-[#080B10] flex items-center justify-center shadow-md">
                    <Code className="w-5 h-5 animate-pulse" />
                  </div>
                  <span className="text-[11px] text-skyz-text dark:text-skyz-accent font-bold">Engineering</span>
                </div>
                <div className="flex-1 h-1 bg-skyz-border mx-2 relative rounded-full overflow-hidden">
                  <div className="absolute h-full w-12 bg-skyz-accent-secondary rounded-full animate-signal-pulse" style={{ animationDelay: '1.2s' }} />
                </div>
                <div className="flex flex-col items-center gap-1 z-10">
                  <div className="w-10 h-10 rounded-full bg-skyz-surface border border-skyz-border flex items-center justify-center text-skyz-accent font-semibold text-xs shadow-sm">
                    PROD
                  </div>
                  <span className="text-[11px] text-skyz-text-muted">Deployment</span>
                </div>
              </div>
            </div>

            {/* Approved Services List */}
            <div className="pt-4 border-t border-skyz-border">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {buildCap.services.map((service) => (
                  <span key={service} className="text-xs px-2.5 py-1 rounded-lg bg-skyz-surface-subtle text-skyz-text border border-skyz-border">
                    {service}
                  </span>
                ))}
              </div>
              <button 
                type="button"
                onClick={() => navigate('contact', { serviceCategory: 'BUILD' })}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-skyz-text hover:text-skyz-accent cursor-pointer"
              >
                <span>Inquire about Build services</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 2: 02 // GROW */}
          <div className="rounded-3xl bg-skyz-surface p-6 sm:p-8 relative overflow-hidden group hover:shadow-xl border border-skyz-border transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-skyz-surface-subtle shadow-sm flex items-center justify-center text-skyz-accent border border-skyz-border group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-6 h-6 text-skyz-accent" />
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-skyz-surface-subtle border border-skyz-border text-skyz-text uppercase font-bold tracking-wider">
                  02 // GROW
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl text-skyz-text font-bold">
                {growCap.title}
              </h3>
              <p className="text-sm sm:text-base text-skyz-text-muted mt-2">
                {growCap.description}
              </p>
            </div>

            {/* Growth Architecture Widget */}
            <div className="my-6 p-4 rounded-2xl bg-skyz-surface-subtle shadow-sm flex items-center justify-center gap-4 border border-skyz-border">
              <div className="w-36 h-28 rounded-2xl bg-skyz-surface p-3 flex flex-col justify-between border border-skyz-border">
                <div className="flex items-center justify-between text-[10px] text-skyz-text-muted font-mono">
                  <span>SEARCH AUDIT</span>
                  <span className="text-skyz-accent font-bold">100%</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 rounded-full bg-skyz-border w-full" />
                  <div className="h-2 rounded-full bg-skyz-accent/40 w-3/4" />
                  <div className="h-2 rounded-full bg-skyz-accent w-5/6" />
                </div>
                <div className="text-[10px] text-skyz-text-muted font-mono">Core Web Vitals</div>
              </div>
              <div className="w-36 h-28 rounded-2xl bg-skyz-text dark:bg-[#1E293B] text-skyz-bg dark:text-white p-3 flex flex-col justify-between shadow-md group-hover:scale-105 transition-transform">
                <span className="text-[11px] font-semibold text-skyz-bg/90 dark:text-white/90">Organic Growth</span>
                <div className="flex items-center justify-center my-auto text-skyz-accent">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="text-[10px] text-center text-skyz-bg/70 dark:text-white/70">Audience Discovery</span>
              </div>
            </div>

            {/* Approved Services List */}
            <div className="pt-4 border-t border-skyz-border">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {growCap.services.map((service) => (
                  <span key={service} className="text-xs px-2.5 py-1 rounded-lg bg-skyz-surface-subtle text-skyz-text border border-skyz-border">
                    {service}
                  </span>
                ))}
              </div>
              <button 
                type="button"
                onClick={() => navigate('contact', { serviceCategory: 'GROW' })}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-skyz-text hover:text-skyz-accent cursor-pointer"
              >
                <span>Inquire about Grow services</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 3: 03 // AUTOMATE */}
          <div className="lg:col-span-2 rounded-3xl bg-skyz-surface p-6 sm:p-8 relative overflow-hidden group hover:shadow-xl border border-skyz-border transition-all duration-300">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-skyz-surface-subtle shadow-sm flex items-center justify-center text-skyz-accent border border-skyz-border group-hover:scale-105 transition-transform">
                    <Bot className="w-6 h-6 text-skyz-accent" />
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-skyz-surface-subtle border border-skyz-border text-skyz-text uppercase font-bold tracking-wider">
                    03 // AUTOMATE
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl text-skyz-text font-bold">
                  {automateCap.title}
                </h3>
                <p className="text-sm sm:text-base text-skyz-text-muted mt-2 max-w-2xl">
                  {automateCap.description}
                </p>
              </div>

              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={() => navigate('contact', { serviceCategory: 'AUTOMATE' })}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] text-xs sm:text-sm font-semibold hover:bg-skyz-accent dark:hover:bg-skyz-accent-secondary transition-all cursor-pointer"
                >
                  <span>Scope Automation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Twin Interactive Visualization Modules */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-6">
              {/* Module A: AI Agent Orchestration */}
              <div className="p-4 rounded-2xl bg-skyz-surface-subtle shadow-sm font-mono text-xs border border-skyz-border overflow-x-auto no-scrollbar">
                <div className="flex items-center justify-between pb-2 text-skyz-text-muted border-b border-skyz-border">
                  <span className="flex items-center gap-1.5 font-medium text-skyz-text">
                    <span className="w-2 h-2 rounded-full bg-skyz-accent animate-pulse" />
                    agent.executor.ts
                  </span>
                  <span className="text-skyz-accent font-bold text-[10px]">AI AGENT WORKFLOW</span>
                </div>
                <div className="space-y-1 mt-2.5 text-skyz-text-muted text-[11px] sm:text-[12px] whitespace-nowrap">
                  <div><span className="text-skyz-accent-secondary font-semibold">export const</span> dispatchTask = <span className="text-skyz-accent font-semibold">async</span> (event) =&gt; &#123;</div>
                  <div className="pl-4 text-skyz-text bg-skyz-surface rounded px-1.5 py-0.5">
                    <span className="text-skyz-text-muted">const</span> result = <span className="text-skyz-accent font-semibold">await</span> runAgentPipeline(event.payload);
                  </div>
                  <div className="pl-4 text-skyz-accent-secondary">return result.syncWithBusinessSystem(&#123; status: &quot;completed&quot; &#125;);</div>
                  <div>&#125;;</div>
                </div>
              </div>

              {/* Module B: Adapted API Integrations */}
              <div className="p-4 rounded-2xl bg-skyz-surface-subtle shadow-sm flex items-center justify-around border border-skyz-border">
                <div className="flex items-center gap-2 sm:gap-4 w-full justify-around">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-xl bg-skyz-surface border border-skyz-border flex items-center justify-center text-skyz-text shadow-sm">
                      <Database className="w-4 h-4 text-skyz-accent" />
                    </div>
                    <span className="text-[10px] text-skyz-text-muted mt-1 font-medium">CRM / DB</span>
                  </div>
                  <div className="flex-1 max-w-[60px] h-0.5 bg-skyz-border relative">
                    <div className="w-2 h-2 rounded-full bg-skyz-accent absolute -top-[3px] animate-ping" />
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] flex items-center justify-center shadow-md">
                      <RefreshCw className="w-4 h-4 animate-spin-slow" />
                    </div>
                    <span className="text-[10px] text-skyz-text dark:text-skyz-accent font-bold mt-1">API Workflow</span>
                  </div>
                  <div className="flex-1 max-w-[60px] h-0.5 bg-skyz-border relative">
                    <div className="w-2 h-2 rounded-full bg-skyz-accent-secondary absolute -top-[3px] animate-ping" style={{ animationDelay: '0.8s' }} />
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-xl bg-skyz-surface border border-skyz-border flex items-center justify-center text-skyz-text shadow-sm">
                      <Cloud className="w-4 h-4 text-skyz-accent" />
                    </div>
                    <span className="text-[10px] text-skyz-text-muted mt-1 font-medium">Cloud Webhooks</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Approved Services List for Automate */}
            <div className="pt-4 border-t border-skyz-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-1.5">
                {automateCap.services.map((service) => (
                  <span key={service} className="text-xs px-2.5 py-1 rounded-lg bg-skyz-surface-subtle text-skyz-text border border-skyz-border">
                    {service}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigate('services', { serviceCategory: 'AUTOMATE' })}
                className="text-xs font-semibold text-skyz-accent hover:underline whitespace-nowrap cursor-pointer"
              >
                Explore all automation specs →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
