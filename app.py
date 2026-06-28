import mysql.connector
from mysql.connector import Error
from datetime import datetime

from flask import Flask,render_template,request,jsonify
app=Flask(__name__)

import pandas as pd
import matplotlib
matplotlib.use('Agg')  
import matplotlib.pyplot as plt
import os

db={
    "host": os.environ.get("sql12.freesqldatabase.com"),
    "user": os.environ.get("sql12831760"),
    "password": os.environ.get("Please wait"),
    "database": os.environ.get("sql12831760")
}
def get_db():
    connection=mysql.connector.connect(**db)
    return connection


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/logs", methods=["GET"])
def get_logs():
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("select * from wasteLogs order by log_time desc")
        logs = cursor.fetchall()
        for log in logs:
            log["log_time"] = log["log_time"].strftime("%d %b %Y, %I:%M %p")
        cursor.close()
        conn.close()
        return jsonify({"success": True, "logs": logs})
    except Error as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/logs", methods=["POST"])
def add_log():
    data = request.get_json()

    waste_type = data["category"]  

    if waste_type in ["Organic", "Food Waste", "Leaves", "Vegetable Peels"]:
        is_compostable = True
        processing_method = "Composting"
        terracotta_recommended = True
    elif waste_type in ["Plastic", "Glass", "Metal", "E-Waste", "Paper"]:
        is_compostable = False
        processing_method = "Recycling"
        terracotta_recommended = False
    else:
        is_compostable = False
        processing_method = "Landfill"
        terracotta_recommended = False

    SOLUTIONS = {
    "Composting": {
        "title": "🌱 Convert to Compost",
        "idea": "Your organic waste will be composted into nutrient-rich fertilizer. Local urban farms and terrace gardeners in your area can collect it within 48 hours.",
        "benefit": "1 kg of food waste → 0.4 kg of compost = feeds 2 plants for a month",
        "action": "Schedule a pickup with GreenCycle volunteers"
    },
    "Recycling": {
        "title": "♻️ Send to Recycling Unit",
        "idea": "Your waste will be shredded and processed at the nearest MRF (Material Recovery Facility). Plastics become park benches, metals become construction rods.",
        "benefit": "Recycling 1 kg of plastic saves 2 kg of CO₂ emissions",
        "action": "Drop at nearest collection point or book a doorstep pickup"
    },
    "Landfill": {
        "title": "🏗️ Managed Landfill Disposal",
        "idea": "This waste type currently has no better option, but it will be sent to a scientifically managed landfill with methane capture — the gas powers nearby streetlights.",
        "benefit": "Managed landfills reduce groundwater contamination by 80%",
        "action": "Consider reducing this waste type in future"
    }
    }

    solution = SOLUTIONS[processing_method]

    required = ["category", "weight", "latitude", "longitude"]
    for field in required:
        if field not in data or str(data[field]).strip() == "":
            return jsonify({"success": False, "error": f"Missing field: {field}"}), 400

    try:
        conn = get_db()
        cursor = conn.cursor()
        sql = """
            insert into wasteLogs (category, weight, latitude, longitude, log_time,is_compostable, processing_method, terracotta_recommended)
            values (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (
            data["category"],
            float(data["weight"]),
            float(data["latitude"]),
            float(data["longitude"]),
            datetime.now(),
            is_compostable,
            processing_method,
            terracotta_recommended
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({
        "success": True,
        "message": "Log saved!",
        "result": {
            "category": data["category"],
            "weight": data["weight"],
            "is_compostable": is_compostable,
            "processing_method": processing_method,
            "terracotta_recommended": terracotta_recommended,
            "solution": solution
        }
        })
    except Error as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/stats", methods=["GET"])
def get_stats():
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            select category, round(sum(weight), 2) as total_weight, count(*) as entries
            from wasteLogs
            group by category
            order by total_weight DESC
        """)
        stats = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({"success": True, "stats": stats})
    except Error as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/analytics")
def analytics():
    try:
        conn = get_db()
        df = pd.read_sql("select * from wasteLogs", conn)
        conn.close()

        if df.empty:
            return render_template("analytics.html", no_data=True)

        df["log_time"] = pd.to_datetime(df["log_time"])

        cat_group = df.groupby("category")["weight"].sum().sort_values(ascending=False)
        fig, ax = plt.subplots(figsize=(8, 4))
        cat_group.plot(kind="bar", ax=ax, color="#52b788", edgecolor="white")
        ax.set_title("Total Waste Logged per Category (kg)", fontsize=13, pad=12)
        ax.set_xlabel("")
        ax.set_ylabel("Weight (kg)")
        ax.set_facecolor("#f0faf4")
        fig.patch.set_facecolor("#f0faf4")
        plt.xticks(rotation=30, ha="right")
        plt.tight_layout()
        plt.savefig("static/charts/chart_bar.png")
        plt.close()

        cat_counts = df["category"].value_counts()
        fig, ax = plt.subplots(figsize=(6, 6))
        ax.pie(cat_counts, labels=cat_counts.index, autopct="%1.1f%%",
               colors=["#52b788","#3b82f6","#8b5cf6","#f59e0b","#06b6d4","#f97316"])
        ax.set_title("Waste Type Distribution", fontsize=13, pad=12)
        fig.patch.set_facecolor("#f0faf4")
        plt.tight_layout()
        plt.savefig("static/charts/chart_pie.png")
        plt.close()

        df_time = df.set_index("log_time").resample("D")["weight"].sum()
        fig, ax = plt.subplots(figsize=(8, 4))
        df_time.plot(kind="line", ax=ax, color="#2d6a4f", marker="o", linewidth=2)
        ax.set_title("Daily Waste Logged Over Time (kg)", fontsize=13, pad=12)
        ax.set_xlabel("")
        ax.set_ylabel("Weight (kg)")
        ax.set_facecolor("#f0faf4")
        fig.patch.set_facecolor("#f0faf4")
        plt.tight_layout()
        plt.savefig("static/charts/chart_line.png")
        plt.close()

        stats = {
            "total_entries": len(df),
            "total_weight": round(df["weight"].sum(), 2),
            "avg_weight": round(df["weight"].mean(), 2),
            "most_common": df["category"].mode()[0],
            "compostable_pct": round((df["is_compostable"].sum() / len(df)) * 100, 1)
        }
        action_chart_exists = False
        if "disposal_action" in df.columns:
            action_counts = df["disposal_action"].dropna().value_counts()
            if not action_counts.empty:
                fig, ax = plt.subplots(figsize=(6, 4))
                colors = ["#2d6a4f", "#3b82f6", "#52b788"]
                action_counts.plot(kind="barh", ax=ax, color=colors[:len(action_counts)])
                ax.set_title("Disposal Method Chosen by Community", fontsize=13, pad=12)
                ax.set_xlabel("Number of Logs")
                ax.set_facecolor("#f0faf4")
                fig.patch.set_facecolor("#f0faf4")
                plt.tight_layout()
                plt.savefig("static/charts/chart_actions.png")
                plt.close()
        return render_template("analytics.html", stats=stats, no_data=False,action_chart_exists=action_chart_exists)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/logs/action", methods=["POST"])
def update_action():
    data = request.get_json()
    action = data.get("action")  

    if action not in ["Dropped", "Doorstep", "Donated"]:
        return jsonify({"success": False, "error": "Invalid action"}), 400

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            update wasteLogs 
            set disposal_action = %s 
            where id = (select max(id) from wasteLogs)
        """, (action,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"success": True})
    except Error as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
