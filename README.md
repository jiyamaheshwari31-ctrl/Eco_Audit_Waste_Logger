# 🌿 EcoAudit — Smart Community Waste Logger

A full-stack web application where community members can log disposed waste with **automatic GPS validation** to prevent fraudulent entries, get real-time disposal guidance, and collectively track environmental impact.


## 🚀 Live Demo
🔗 [Deployed Link](#) 

## 💡 What It Does

A user visits EcoAudit and:
1. Selects a waste category and enters weight
2. The browser automatically captures their GPS location (no manual input — anti-fraud)
3. The system classifies the waste and shows a result screen with:
   - Whether the waste is compostable, recyclable, or landfill-bound
   - An innovative disposal solution with real environmental impact stats
   - A terracotta composting recommendation for organic waste
   - Two action buttons: Drop at Nearest Point or Book Doorstep Pickup
   - An optional donation QR (UPI)
4. Their choice (Drop/Pickup/Donate) is recorded for analytics
5. The community dashboard updates in real time
6. An analytics page powered by **pandas + matplotlib** visualizes community trends

---

## 🛠️ Tech Stack

Backend: Python + Flask 
Database: MySQL
Frontend: HTML5 / CSS3 / Vanilla JavaScript
Map: Leaflet.js + OpenStreetMap
Data Analysis: pandas + matplotlib
Geolocation: Browser Native Geolocation API

### Extra Features (Beyond Requirements)
- ✅ Auto waste classification — Composting / Recycling / Landfill logic in Python
- ✅ Result screen — personalized disposal guidance after every log
- ✅ Terracotta composting recommendation for organic waste
- ✅ Disposal action tracking — Drop at Point / Doorstep Pickup / Donate recorded in DB
- ✅ Analytics dashboard — pandas + matplotlib generating 4 live charts:
  - Total waste per category (bar chart)
  - Waste type distribution (pie chart)
  - Daily waste logged over time (line chart)
  - Disposal method chosen by community (horizontal bar)
- ✅ Pandas summary stats — total logs, avg weight, most common category, % compostable
- ✅ Optional UPI donation QR

---

## Project Structure
EcoAudit/
├── app.py                  ← Flask backend (all API routes + pandas/matplotlib)
├── setup_db.sql            ← MySQL schema (run once before starting)
├── requirements.txt
├── README.md
├── templates/
│   ├── index.html          ← Main page (form + map + dashboard)
│   └── analytics.html      ← Analytics page (charts + stats)
└── static/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js         ← Geolocation + API calls + result screen
    └── charts/             ← Auto-generated matplotlib chart PNGs


## How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ecoaudit.git
cd ecoaudit
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Set up MySQL database
Open MySQL Workbench and run:
```bash
source setup_db.sql
```

### 4. Configure database credentials
Open `app.py` and update:
```python
db = {
    "host": "localhost",
    "user": "root",
    "password": "yourpassword",  ← change this
    "database": "ecoAudit"
}
```

### 5. Create charts folder
```bash
mkdir static/charts
```

### 6. Run Flask
```bash
python app.py
```

Open your browser at **http://127.0.0.1:5000**

> ⚠️ Geolocation requires HTTPS in production. Locally, use Microsoft Edge or enable Chrome flags.

---

## 📊 API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/` | Serves main page |
| GET | `/analytics` | Serves analytics page with charts |
| GET | `/api/logs` | Fetch all waste logs |
| POST | `/api/logs` | Submit a new waste log |
| GET | `/api/stats` | Fetch aggregated category totals |
| POST | `/api/logs/action` | Record disposal action chosen by user |

---

## 🗄️ Database Schema

```sql
CREATE TABLE wasteLogs (
    id                    INT AUTO_INCREMENT PRIMARY KEY,
    category              VARCHAR(50),
    weight                DECIMAL(8,2),
    latitude              DECIMAL(10,6),
    longitude             DECIMAL(10,6),
    log_time              DATETIME,
    is_compostable        BOOLEAN,
    processing_method     VARCHAR(20),
    terracotta_recommended BOOLEAN,
    disposal_action       VARCHAR(20) DEFAULT NULL
);
```

---

## 🔮 Future Improvements
- User authentication so logs are tied to individual accounts
- Monthly leaderboard — top 3 community contributors get rewards
- ML model to auto-classify waste from an uploaded photo
- Push notifications when doorstep pickup is confirmed
- Export analytics report as PDF

---

## About

Built by **Jiya Maheshwari**.
I knew Python and MySQL before this task. I learned Flask, REST APIs, the Browser Geolocation API, Leaflet.js, and pandas/matplotlib integration specifically to complete this.


## Requirements
flask
mysql-connector-python
pandas
matplotlib

