"""
AI Chatbot for Student Query Assistance & Campus Information
Course: CSA1709 Artificial Intelligence (Capstone Project)
------------------------------------------------------------
Module 1: Natural Language Understanding (NLU) & Intent Recognition
Module 2: Dialogue Management & Response Generation
Module 3: Multi-Channel Web Interface & Analytics API
"""

from flask import Flask, request, jsonify, render_to_response, send_from_directory
import os
import json
import re
import math
import time

app = Flask(__name__, static_folder=".", static_url_path="")

# =============================================================================
# KNOWLEDGE BASE
# =============================================================================
CAMPUS_KB = {
    "departments": [
        {"id": "cse", "name": "Computer Science and Engineering", "code": "CSE", "hod": "Dr. Sarah Jenkins", "office": "Tech Block 3, Room 302", "email": "hod.cse@campus.edu", "phone": "+1 (555) 234-5601", "programs": ["B.Tech CSE", "M.Tech AI & Data Science", "Ph.D. Computer Science"]},
        {"id": "ai", "name": "Artificial Intelligence & Machine Learning", "code": "AIML", "hod": "Dr. Robert Vance", "office": "Tech Block 4, Room 410", "email": "hod.ai@campus.edu", "phone": "+1 (555) 234-5602", "programs": ["B.Tech AI & ML", "M.Tech Robotics"]},
        {"id": "ece", "name": "Electronics and Communication Engineering", "code": "ECE", "hod": "Dr. Anita Roy", "office": "Tech Block 2, Room 204", "email": "hod.ece@campus.edu", "phone": "+1 (555) 234-5603", "programs": ["B.Tech ECE", "M.Tech VLSI Design"]},
        {"id": "me", "name": "Mechanical Engineering", "code": "MECH", "hod": "Dr. Daniel Morales", "office": "Engineering Block 1, Room 105", "email": "hod.mech@campus.edu", "phone": "+1 (555) 234-5604", "programs": ["B.Tech Mechanical", "M.Tech Thermal Eng."]},
        {"id": "mba", "name": "Department of Management Studies", "code": "MBA", "hod": "Dr. Priya Nambiar", "office": "Management Block, Room 201", "email": "hod.mba@campus.edu", "phone": "+1 (555) 234-5605", "programs": ["MBA Finance", "MBA Marketing", "MBA Business Analytics"]}
    ],
    "examSchedules": [
        {
            "semester": "Semester 4",
            "type": "End-Semester Theory Examinations (Regular & Arrear)",
            "startDate": "October 15, 2026",
            "endDate": "October 30, 2026",
            "sessionTime": "Forenoon: 09:30 AM - 12:30 PM | Afternoon: 01:30 PM - 04:30 PM",
            "hallTicketRelease": "October 05, 2026 via Student Portal"
        },
        {
            "semester": "Semester 6",
            "type": "End-Semester Examinations",
            "startDate": "November 02, 2026",
            "endDate": "November 16, 2026",
            "sessionTime": "09:30 AM - 12:30 PM",
            "hallTicketRelease": "October 24, 2026 via Student Portal"
        }
    ]
}

# =============================================================================
# MODULE 1: NLU & INTENT RECOGNITION (Python Core)
# =============================================================================
STOP_WORDS = {
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as',
    'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can',
    'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further',
    'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'him', 'his', 'how', 'i', 'if', 'in',
    'into', 'is', 'it', 'its', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off',
    'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'out', 'over', 'own', 'same', 'she',
    'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'then', 'there',
    'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was',
    'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'you', 'your', 'please', 'tell'
}

INTENT_DATASET = [
    {
        "intent": "greeting",
        "keywords": ["hello", "hi", "hey", "morning", "afternoon", "evening", "greetings"],
        "examples": ["hello", "hi", "hey", "good morning", "start chat"]
    },
    {
        "intent": "exam_schedule",
        "keywords": ["exam", "examination", "timetable", "schedule", "date", "hallticket", "timing", "cat"],
        "examples": ["when is exam", "exam timetable", "sem 4 schedule", "cat 2 date"]
    },
    {
        "intent": "course_info",
        "keywords": ["course", "syllabus", "curriculum", "credit", "degree", "subject", "btech", "mtech", "program"],
        "examples": ["what courses are offered", "cse syllabus", "btech programs", "credits"]
    },
    {
        "intent": "fees_scholarship",
        "keywords": ["fee", "tuition", "pay", "payment", "scholarship", "cost", "due", "financial"],
        "examples": ["tuition fee", "how to pay fee", "scholarship criteria", "hostel fee"]
    },
    {
        "intent": "hostel_mess",
        "keywords": ["hostel", "mess", "room", "warden", "curfew", "food", "dinner", "breakfast", "dorm"],
        "examples": ["hostel fee", "mess timings", "warden contact", "curfew hours"]
    },
    {
        "intent": "library_facility",
        "keywords": ["library", "book", "borrow", "timing", "hours", "digital", "ieee"],
        "examples": ["library timings", "borrow books", "digital library access"]
    },
    {
        "intent": "placement_internship",
        "keywords": ["placement", "internship", "package", "salary", "recruiter", "job", "company", "highest"],
        "examples": ["placement statistics", "highest package", "top recruiters", "summer internship"]
    },
    {
        "intent": "faculty_directory",
        "keywords": ["faculty", "professor", "hod", "teacher", "contact", "email", "office"],
        "examples": ["who is hod", "professor contact", "cse faculty email"]
    },
    {
        "intent": "campus_wifi_it",
        "keywords": ["wifi", "internet", "network", "login", "portal", "ssid", "quota"],
        "examples": ["how to connect wifi", "wifi password", "it helpdesk"]
    },
    {
        "intent": "human_escalation",
        "keywords": ["human", "person", "agent", "representative", "talk", "connect", "escalate"],
        "examples": ["talk to human", "connect to agent", "escalate query"]
    }
]

def preprocess(text):
    cleaned = re.sub(r'[^\w\s]', ' ', text.lower())
    tokens = cleaned.split()
    lemmas = [t for t in tokens if t not in STOP_WORDS]
    return tokens, lemmas

def extract_entities(text):
    entities = []
    lower = text.lower()
    
    # Semester
    sem_match = re.search(r'(sem|semester)\s*([1-8])', lower)
    if sem_match:
        entities.append({"type": "semester", "value": f"Semester {sem_match.group(2)}"})
        
    # Department
    if "cse" in lower or "computer" in lower:
        entities.append({"type": "department", "value": "CSE"})
    elif "ai" in lower or "machine learning" in lower:
        entities.append({"type": "department", "value": "AIML"})
    elif "ece" in lower:
        entities.append({"type": "department", "value": "ECE"})
    elif "mech" in lower:
        entities.append({"type": "department", "value": "MECH"})
        
    return entities

def classify_intent(lemmas, raw_text):
    scores = {}
    lower_raw = raw_text.lower().strip()
    
    # Exact greeting
    if lower_raw in ["hi", "hello", "hey", "good morning"]:
        return "greeting", 0.99
        
    for item in INTENT_DATASET:
        intent = item["intent"]
        score = 0
        for kw in item["keywords"]:
            if kw in lemmas or kw in lower_raw:
                score += 1
        scores[intent] = score

    best_intent = max(scores, key=scores.get)
    if scores[best_intent] > 0:
        confidence = min(0.98, 0.4 + (scores[best_intent] * 0.2))
        return best_intent, confidence
    return "fallback", 0.20

# =============================================================================
# API ROUTES
# =============================================================================
@app.route("/")
def index():
    return send_from_directory(".", "index.html")

@app.route("/dashboard")
def dashboard():
    return send_from_directory(".", "dashboard.html")

@app.route("/api/nlu", methods=["POST"])
def api_nlu():
    data = request.get_json() or {}
    text = data.get("text", "")
    t0 = time.time()
    
    tokens, lemmas = preprocess(text)
    entities = extract_entities(text)
    intent, confidence = classify_intent(lemmas, text)
    latency_ms = max(1, int((time.time() - t0) * 1000))
    
    return jsonify({
        "query": text,
        "tokens": tokens,
        "lemmas": lemmas,
        "entities": entities,
        "intent": intent,
        "confidence": confidence,
        "latencyMs": latency_ms
    })

@app.route("/api/knowledge", methods=["GET"])
def api_knowledge():
    return jsonify(CAMPUS_KB)

@app.route("/api/health", methods=["GET"])
def api_health():
    return jsonify({"status": "active", "service": "AI Campus Assistant", "modules": ["Module 1", "Module 2", "Module 3"]})

if __name__ == "__main__":
    print("≡ƒÜÇ AI Campus Assistant Server starting on http://127.0.0.1:5000 ...")
    app.run(host="0.0.0.0", port=5000, debug=True)
