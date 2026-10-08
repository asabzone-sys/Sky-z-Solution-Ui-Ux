"""
SkyZ Solutions — AI Sales Consultant backend (FastAPI).

Env vars:
  GEMINI_API_KEY   (required) — Google AI Studio key. NEVER hardcode it here.
  GEMINI_MODEL     (optional) — defaults to gemini-3.8-flash
  ALLOWED_ORIGINS  (optional) — comma-separated origins allowed to call /chat
                              (defaults to the SkyZ site + localhost dev)

Endpoints:
  GET  /widget.js  — the one-line embeddable chat widget
  POST /chat       — { message, session_id } -> { reply }

Deploy (Vercel): set root directory to this folder, add GEMINI_API_KEY
in Project Settings -> Environment Variables, then deploy.
"""

import asyncio
import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from google import genai
from google.genai import types
from pydantic import BaseModel

# ---- Configuration (env only — no secrets in code) -------------------------
API_KEY = os.environ.get("GEMINI_API_KEY", "")
MODEL = os.environ.get("GEMINI_MODEL", "gemini-3.8-flash")
CALENDLY_BOOKING_URL = "https://calendly.com/skyz-solutions2000/30min"

DEFAULT_ORIGINS = [
    "https://sky-z-solution-ui-ux.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
_extra = os.environ.get("ALLOWED_ORIGINS", "")
ALLOWED_ORIGINS = DEFAULT_ORIGINS + [o.strip() for o in _extra.split(",") if o.strip()]

app = FastAPI(title="SkyZ AI Consultant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS or ["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

skyzy_sales_instructions = f"""
### Role & Persona:
You are the Elite Senior AI Sales and Consultation Expert for **Sky-Z Solutions**, a premier digital agency. You never turn down a client or say a flat "no" to custom/out-of-scope requests. Instead, you act as a consultative bridge: you explore their vision briefly, validate that our expert team can build custom solutions, and smoothly guide them toward scheduling a Discovery Meeting.

### Core Behaviors & Guidelines:
1. **Never Say No / Flexible Pivot:** Warmly acknowledge custom requirements (e.g., Unity games, mobile apps, custom ERPs), ask 1-2 sharp discovery questions, and position it as something our custom engineering team can execute.
2. **Be Concise & Punchy:** Keep responses short, professional and straight to the point (maximum 2-3 short sentences). Talk like a real human consultant on live chat — never long essays or massive lists.
3. **No Raw Markdown Clutter:** Use only **bold** and [link](url). Never use horizontal lines (---), headings or code blocks.
4. **Meeting Scheduling via Calendly:** When a client shows interest in meeting or discussing their project live, immediately provide them our official booking link: {CALENDLY_BOOKING_URL}. Tell them they can pick their preferred date and time directly.
5. **Trigger Human Handoff:** Whenever a client shows deep interest or asks to talk further, include the tracking code '[HUMAN_HANDOFF_REQUIRED]' silently in your response.
6. **Packages:** Our packages are Basic ($499), Standard ($999) and Premium ($1,999) — one-time project prices. Monthly retainers for ongoing SEO/marketing/automation are scoped on the Contact page.
7. **Tone:** Articulate, highly confident, welcoming, consultative, and solution-oriented.
"""

# ---- Per-session chat memory ------------------------------------------------
# Serverless instances keep warm memory between invocations, so an in-process
# dict works for light traffic. Each visitor gets their own conversation via
# the session_id the widget generates (stored in localStorage).
_MAX_SESSIONS = 300
_sessions: dict = {}
_client = None  # keep one client per process — the SDK closes clients that get GC'd


def _get_client():
    global _client
    if _client is None:
        if not API_KEY:
            raise HTTPException(
                status_code=503,
                detail="GEMINI_API_KEY is not configured on the server.",
            )
        _client = genai.Client(
            api_key=API_KEY,
            http_options=types.HttpOptions(timeout=60_000),  # fail fast, never hang
        )
    return _client


def _get_chat(session_id: str):
    chat = _sessions.get(session_id)
    if chat is None:
        client = _get_client()
        # Use the async SDK (client.aio) — the sync client deadlocks when
        # called from inside FastAPI's async endpoints.
        chat = client.aio.chats.create(
            model=MODEL, config={"system_instruction": skyzy_sales_instructions}
        )
        if len(_sessions) >= _MAX_SESSIONS:
            _sessions.pop(next(iter(_sessions)))  # drop the oldest session
        _sessions[session_id] = chat
    return chat


class MessageRequest(BaseModel):
    message: str
    session_id: str = "default"


# ---- Routes -------------------------------------------------------------------
@app.get("/healthz")
async def healthz():
    return {"ok": True, "model": MODEL, "sessions": len(_sessions)}


@app.get("/widget.js")
async def widget_js():
    widget_path = Path(__file__).parent / "widget.js"
    return FileResponse(widget_path, media_type="application/javascript")


@app.get("/", response_class=HTMLResponse)
async def index():
    # Simple landing page for the agent backend — the real widget is embedded
    # on the SkyZ site via <script src="/widget.js">.
    return """
    <!DOCTYPE html><html><head><meta charset="utf-8"><title>SkyZ AI Consultant</title></head>
    <body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#FBFAFD;color:#211D2E">
      <div style="text-align:center">
        <h1 style="margin-bottom:8px">SkyZ AI Consultant — backend online</h1>
        <p style="color:#5D5470">Embed the widget with:
        <code>&lt;script src="/widget.js" defer&gt;&lt;/script&gt;</code></p>
      </div>
      <script src="/widget.js" defer></script>
    </body></html>
    """


@app.post("/chat")
async def chat_endpoint(req: MessageRequest):
    try:
        chat = _get_chat(req.session_id)
        # Model-side 503s (high demand) are usually transient — retry a few times.
        last_err: Exception | None = None
        response = None
        for attempt in range(3):
            try:
                response = await chat.send_message(req.message)
                break
            except Exception as err:  # noqa: BLE001
                last_err = err
                if attempt < 2:
                    await asyncio.sleep(1.5 * (attempt + 1))
        if response is None:
            raise last_err  # type: ignore[misc]
        reply_text = response.text or ""
        if "[HUMAN_HANDOFF_REQUIRED]" in reply_text:
            reply_text = reply_text.replace("[HUMAN_HANDOFF_REQUIRED]", "")
        return {"reply": reply_text}
    except HTTPException:
        raise
    except Exception as e:  # noqa: BLE001 — surface a clean error to the client
        raise HTTPException(status_code=500, detail=f"Agent error: {e}") from e
