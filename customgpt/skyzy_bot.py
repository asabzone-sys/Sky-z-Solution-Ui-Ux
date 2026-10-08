import os
import time
from google import genai
from google.genai.errors import ServerError

# Client initialize karein — key env var se (never hardcode!):
#   Windows:  set GEMINI_API_KEY=your-key   |   PowerShell: $env:GEMINI_API_KEY="your-key"
_api_key = os.environ.get("GEMINI_API_KEY")
if not _api_key:
    raise SystemExit("GEMINI_API_KEY env var set karein, e.g. set GEMINI_API_KEY=your-key")
client = genai.Client(api_key=_api_key)

# Aapka Calendly link (Yahan aap apna real Calendly link daal sakte hain)
CALENDLY_BOOKING_URL = "https://calendly.com/skyz-solutions2000/30min"

# System Instructions with Calendly & Sales Persona
skyzy_sales_instructions = f"""
### Role & Persona:
You are the Elite Senior AI Sales and Consultation Expert for **Skyzy Solution**, a premier digital agency. You never turn down a client or say a flat "no" to custom/out-of-scope requests. Instead, you act as a consultative bridge: you explore their vision briefly, validate that our expert team can build custom solutions, and smoothly guide them toward scheduling a Discovery Meeting using our official Calendly booking link.

### Core Behaviors & Guidelines:
1. **Never Say No / Flexible Pivot:** Warmly acknowledge custom requirements (e.g., Unity games, mobile apps, custom ERPs), ask 1-2 sharp discovery questions, and position it as something our custom engineering team can execute.
2. **Meeting Scheduling via Calendly:** When a client shows interest in meeting or discussing their project live, immediately provide them our official booking link: {CALENDLY_BOOKING_URL}. Tell them they can pick their preferred date and time directly.
3. **Trigger Human Handoff:** Whenever a client shows deep interest or asks to talk further, include the tracking code '[HUMAN_HANDOFF_REQUIRED]' silently in your response.
4. **Tone & Style:** Articulate, highly confident, welcoming, consultative, and solution-oriented.
"""


def run_skyzy_expert_chat():
  chat = client.chats.create(
      model="gemini-3.8-flash", config={"system_instruction": skyzy_sales_instructions}
  )

  print(
      "=== Skyzy Solution Professional Sales Assistant (Calendly Ready) ==="
      "\nType 'exit' or 'quit' to end.\n"
  )

  while True:
    user_msg = input("User: ")
    if user_msg.lower() in ["exit", "quit"]:
      print("Skyzy Bot: Goodbye! Looking forward to collaborating with you.")
      break

    success = False
    attempts = 3
    for attempt in range(attempts):
      try:
        response = chat.send_message(user_msg)
        reply_text = response.text

        # Check for human hand-off trigger
        if "[HUMAN_HANDOFF_REQUIRED]" in reply_text:
          reply_text = reply_text.replace("[HUMAN_HANDOFF_REQUIRED]", "")
          print(
              "\n[SYSTEM ALERT: Client is a prime lead! Admin notification"
              " triggered for meeting/hand-off!]\n"
          )

        print(f"Skyzy Bot: {reply_text}\n")
        success = True
        break
      except ServerError:
        if attempt < attempts - 1:
          time.sleep(2)
        else:
          print(
              "Skyzy Bot: Server is busy right now. Please try again in a"
              " moment.\n"
          )
      except Exception as e:
        print(f"Skyzy Bot: An error occurred: {e}\n")
        break


if __name__ == "__main__":
  run_skyzy_expert_chat()