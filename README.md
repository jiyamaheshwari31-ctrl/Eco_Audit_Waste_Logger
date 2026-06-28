# 🌿 EcoAudit — Smart Community Waste Logger

A full-stack web application where community members can log disposed waste with **automatic GPS validation** to prevent fraudulent entries, get real-time disposal guidance, and collectively track environmental impact.


## Live Demo
🔗 https://eco-audit-waste-logger.onrender.com

## What It Does

A user visits EcoAudit and:
1. Selects a waste category and enters weight.
2. The browser automatically captures their GPS location (no manual input — anti-fraud).
3. The system classifies the waste and shows a result screen with:
   - Whether the waste is compostable, recyclable or landfill-bound.
   - An innovative disposal solution with real environmental impact stats.
   - A terracotta composting recommendation for organic waste.
   - Two action buttons: Drop at Nearest Point or Book Doorstep Pickup.
   - An optional donation QR (UPI).
4. Their choice (Drop/Pickup/Donate) is recorded for analytics.
5. The community dashboard updates in real time.
6. An analytics page powered by **pandas + matplotlib** visualizes community trends.


## Tech Stack

1. Backend: Python + Flask 
2. Database: MySQL
3. Frontend: HTML5 / CSS3 / Vanilla JavaScript
4. Map: Leaflet.js + OpenStreetMap
5. Data Analysis: pandas + matplotlib
6. Geolocation: Browser Native Geolocation API

### Additional Features
- Auto waste classification — Composting / Recycling / Landfill logic in Python.
- Result screen — personalized disposal guidance after every log.
- Analytics dashboard — pandas + matplotlib generating 4 live charts:
  - Total waste per category (bar chart)
  - Waste type distribution (pie chart)
  - Daily waste logged over time (line chart)
  - Disposal method chosen by community (horizontal bar)
- Pandas summary stats — total logs, avg weight, most common category, % compostable.
- Optional UPI donation QR.

## How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/jiyamaheshwari31-ctrl/Eco_Audit_Waste_Logger.git
cd ecoaudit
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Set the following environment variables on your system:
```bash
DB_HOST=your-mysql-host

DB_USER=your-username

DB_PASSWORD=your-password

DB_NAME=your-database-name
```

### 4. Create charts folder
```bash
mkdir static/charts
```

### 5. Run Flask
```bash
python app.py
```

Open browser and go to `http://localhost:5000`

## Future Improvements
- User authentication like username and OTP so that logs are tied to individual accounts
- Monthly leaderboard: top 3 community contributors get rewards to encourage cleanliness in surroundings
- Push notifications when doorstep pickup is confirmed
- Two step verification from both user and nearest point

## About

Built by **Jiya Maheshwari**.
I knew Python, pandas/matplotlib integration and MySQL before this task. I learned Flask, REST APIs, the Browser Geolocation API and Leaflet.js specifically to complete this.


## Requirements
flask
mysql-connector-python
pandas
matplotlib

