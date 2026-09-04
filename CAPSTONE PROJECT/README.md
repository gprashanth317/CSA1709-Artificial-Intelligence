# AI Chatbot for Student Query Assistance and Campus Information
**Course:** CSA1709 Artificial Intelligence (Capstone Project)

---

## 📖 Project Overview
The **AI Campus Assistant** is an intelligent, responsive, multi-channel conversational system engineered to assist university students with instant, verified information on examinations, academic curriculum, fee payments, hostel & dining facilities, library resources, placements, and campus transit.

---

## 🏛️ System Architecture: Three Core Modules

### 1. Module 1: Natural Language Understanding (NLU) & Intent Recognition
- **NLP Preprocessing Pipeline:** Case normalization, tokenization, stop-words removal, domain lemmatization, and Levenshtein typo correction.
- **Intent Classifier:** 18+ comprehensive campus intents classified using TF-IDF vectorization + Cosine Similarity and keyword boosting.
- **Named Entity Recognition (NER):** Extracts campus entities including `@department`, `@course`, `@semester`, `@exam_type`, `@facility`, `@date_time`, `@hostel_block`, and `@person_role`.
- **Confidence Scoring:** Outputs classification confidence percentages (0-100%) and provides confidence thresholding.

### 2. Module 2: Dialogue Management & Response Generation
- **Context State Tracking:** Tracks multi-turn parameters (`activeDepartment`, `activeSemester`, `activeCourse`, `missingSlot`, and `turnCount`).
- **Slot Filling Engine:** Proactively prompts users for missing slots (e.g. asking for semester when querying exam timetables).
- **Dynamic Rich Widgets:** Generates interactive tables, fee schedules, contacts, clickable quick-reply chips, and portal links.
- **Human Escalation:** Generates trackable support tickets (`TKT-XXXXXX`) for complex grievances and advisor hand-off.

### 3. Module 3: Deployment, Multi-Channel Integration & Analytics Hub
- **AI WebChat Assistant:** Full-featured desktop & mobile web app with Speech-to-Text (Voice input), Text-to-Speech (Voice readout), dark/light mode toggle, and chat export (JSON/PDF).
- **WhatsApp Simulator:** Simulated mobile channel replicating WhatsApp Business conversational flows.
- **NLU Inspector & Debugger:** Real-time side drawer revealing token arrays, lemmatized tokens, top-3 intent confidence bars, extracted entity chips, and raw JSON payload.
- **Campus Knowledge Base Explorer:** Searchable, filterable database of university records.
- **Live Analytics & Evaluation Hub:** Real-time tracking of queries, intent distribution, response latency, fallback rates, and precision/recall/F1 evaluation matrices.

---

## 🚀 How to Run the Project

### Option A: Direct Browser Execution (Zero Setup)
Simply open `index.html` or `dashboard.html` in any modern web browser:
```bash
# In Windows Powershell / Command Prompt:
Start-Process index.html
```

### Option B: Local Python HTTP Server
```bash
python -m http.server 8000
# Then open http://localhost:8000 in your browser
```

### Option C: Python Flask Backend API
```bash
pip install -r requirements.txt
python app.py
# Server runs on http://127.0.0.1:5000
```

---

## 🔑 Demo Login Credentials
- **Student Account:** `student@campus.edu` / `Student@123`
- **Student ID:** `192311366` / `Student@123`
- **Evaluator Access:** `admin@campus.edu` / `Admin@123`
- *Or click either of the **One-Click Quick Demo** buttons on the login page.*
