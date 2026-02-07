import os
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai

# --------------------------------------------------
# Load environment variables
# --------------------------------------------------

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# --------------------------------------------------
# FastAPI app
# --------------------------------------------------
app = FastAPI(title="SCIMIT '26 Chatbot API")

@app.get("/")
def health_check():
    return {
        "status": "ok",
        "service": "SCIMIT26 Chatbot",
        "message": "Backend is awake"
    }


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://merrilytowin.github.io"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# INTENT RESPONSES (STATIC – PERFECT FORMAT)
# --------------------------------------------------

COORDINATOR_INFO = """
📌 SCIMIT’26 – Coordinator Details

👥 Main Coordinators
• Dr. M. Sumithra  
  Associate Professor  
  📞 94436 38459

• Dr. S. Sivaramakrishnan  
  Associate Professor  
  📞 94864 23986

• Mr. J. Vijayraghavan  
  Assistant Professor  
  📞 97512 49883

🎓 Convenor
• Dr. C. Shanmugasundaram  
  Professor & Head, Department of EEE

🎓 Co-Convenor
• Mr. D. Muruganandhan  
  Assistant Professor (EEE)

🏫 Department Coordinators
• Mechanical / Civil / Food Technology / Robotics & Automation  
  Mr. S. Ganeshkumar  
  📞 96294 29453

• Electronics & Communication Engineering (ECE)  
  Mr. V. Rajesh  
  📞 98941 84602

• Computer Science / IT / IoT / AI & ML  
  Mr. R. Sathishkumar  
  📞 86674 91392

• Electrical & Electronics Engineering (EEE)  
  Mr. D. Balaji  
  📞 99441 61030
"""

# --------------------------------------------------
# FULL EVENT CONTEXT (FOR GEMINI ONLY)
# --------------------------------------------------

EVENT_CONTEXT = """
You are the official SCIMIT’26 Help & Support Chatbot.

RESPONSE FORMAT RULES:
- Use emojis for headings
- Use bullet points with "•"
- Add blank lines between sections
- No markdown symbols (*, **, ###)
- Plain readable text only

If the question is unrelated, reply:
"I can help only with SCIMIT’26 event-related queries."

Event Name: SCIMIT’26 – A Mega Project Contest
Event Type: Project Expo
Occasion: National Science Day Celebration

Organized By:
Manakula Vinayagar Institute of Technology (MVIT)
An Autonomous Institution
Affiliated to Pondicherry University
Approved by AICTE
Accredited by NBA & NAAC with A+ Grade

Institution Location:
Kalitheerthalkuppam, Puducherry – 605 107

Eligibility:
Engineering and Polytechnic students

Registration:
Online registration via link / QR code provided in the brochure.
Last Date: 18th February 2026
Selection Intimation: 20th February 2026

Prizes:
1st Prize ₹50,000
2nd Prize ₹25,000
3rd Prize ₹12,500
18 Consolation Prizes ₹3,000 each
(for deserving projects)

Accommodation:
Free accommodation will be provided for outstation participants.

Travel Allowance (TA):
TA will be paid for outstation participants traveling more than 200 km.

Transport Facility Available From:
- Puducherry (Pondy)
- Villupuram
- Cuddalore
- Neyveli
- Tindivanam

Contact:
Email: scimit2026@mvit.edu.in
Website: www.mvit.edu.in

IMPORTANT NOTES: 
- The event is conducted strictly as per the rules of the organizing institution.
- All facilities and prizes are subject to applicable terms and conditions.
- Participants are advised to follow official communication channels for updates.
"""

# --------------------------------------------------
# Request / Response Models
# --------------------------------------------------

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

# --------------------------------------------------
# Response Cleaner (Safety Net)
# --------------------------------------------------

def clean_response(text: str) -> str:
    text = re.sub(r"[*_#>`]", "", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()

# --------------------------------------------------
# Chat Endpoint (INTENT-FIRST)
# --------------------------------------------------

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    user_msg = req.message.lower()

    # ---- Intent Routing (NO GEMINI) ----
    if any(word in user_msg for word in ["coordinator", "co ordinator", "contact person"]):
        return {"reply": COORDINATOR_INFO}

    # ---- Gemini fallback ----
    prompt = EVENT_CONTEXT + "\n\nUser Question: " + req.message

    response = client.models.generate_content(
        model="models/gemini-2.5-flash-lite",
        contents=prompt
    )

    return {"reply": clean_response(response.text)}
