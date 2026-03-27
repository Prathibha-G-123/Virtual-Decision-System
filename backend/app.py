from flask import Flask, request, jsonify  # type: ignore
from flask_cors import CORS  # type: ignore
import sqlite3
import os
from information_engine import process_information
from decision_engine import generate_decision

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), 'decision_system.db')

def init_db():
    if not os.path.exists(DB_PATH):
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('''
            CREATE TABLE IF NOT EXISTS Projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                domain TEXT,
                description TEXT,
                extracted_complexity INTEGER,
                predicted_delay REAL
            )
        ''')
        conn.commit()
        conn.close()

init_db()

@app.route('/api/login', methods=['POST'])
def login():
    return jsonify({'success': True})

@app.route('/api/register', methods=['POST'])
def register():
    return jsonify({'success': True})

@app.route('/api/<domain>', methods=['POST'])
def unified_pipeline(domain):
    if domain not in ['project', 'healthcare', 'business']:
        return jsonify({'error': 'Unknown domain requested'}), 400
        
    raw_data = request.json
    layer1_info = process_information(domain, raw_data)
    layer2_decision, layer3_charts = generate_decision(domain, layer1_info)
    
    return jsonify({
        "information": layer1_info,
        "decision": layer2_decision,
        "chartData": layer3_charts
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
