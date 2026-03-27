def generate_decision(domain, parsed_info):
    decision = {}
    chartData = {}
    
    if domain == 'healthcare':
        cm = parsed_info['context_metrics']
        ratio = cm['patient_load'] / max(1, cm['staff_availability'])
        
        recs = []
        if ratio > 8:
            risk = "High"
            recs.append(f"Add {int(ratio - 5)} nurses to stabilize patient-to-staff ratio.")
            recs.append("Priority Code: Divert non-critical patients.")
        elif 'high' in cm['emergency_level']:
            risk = "High"
            recs.append("High Emergency capacity reached. Pre-allocate ICU beds.")
        else:
            risk = "Low"
            recs.append("Capacity is stable. Maintain current staffing levels.")
            
        decision = {
            "risk_level": risk,
            "final_recommendations": recs,
            "priority_strategy": "Triage Active" if risk == 'High' else "Standard Protocol"
        }
        chartData = {
            "pie": [
                {"name": "Patients", "value": cm['patient_load'], "fill": "#f43f5e"},
                {"name": "Staff Capacity", "value": cm['staff_availability'] * 5, "fill": "#10b981"}
            ],
            "radial": [
                {"name": "Workload Intensity", "value": min(100, int((ratio / 10) * 100)), "fill": "#059669"}
            ]
        }
        
    elif domain == 'business':
        cm = parsed_info['context_metrics']
        roi = ((cm['expected_revenue'] - cm['budget']) / max(1, cm['budget'])) * 100
        
        recs = []
        if roi < 10 or 'high' in cm['market_risk']:
            risk = "High"
            recs.append("Risky Investment: Restructure budget allocations immediately.")
        else:
            risk = "Low" if roi > 30 else "Medium"
            recs.append("Safe Investment trajectory. Procedural budget optimization recommended.")
            
        decision = {
            "risk_level": risk,
            "final_recommendations": recs,
            "budget_optimization": "Shift 20% budget to low-risk acquisition channels." if risk == 'High' else "Maintain current CAPEX structure."
        }
        chartData = {
            "bar": [
                {"name": "Financials", "Budget": cm['budget'], "Revenue": cm['expected_revenue']}
            ],
            "line": [
                {"month": "M1", "ROI": min(roi/4, 10)},
                {"month": "M2", "ROI": min(roi/2, 20)},
                {"month": "M3", "ROI": min(roi, 50)},
                {"month": "M4", "ROI": roi}
            ]
        }
        
    elif domain == 'project':
        cm = parsed_info['context_metrics']
        recs = ["Hire DevOps expert.", "Implement Automated CI/CD pipelines to unblock tickets."]
        
        decision = {
            "risk_level": "Medium" if cm['deadline_pressure'] < 14 else "Low",
            "final_recommendations": recs,
            "timeline_adjustment": f"Buffer iteration cycles by {int(300 / max(1, cm['deadline_pressure']))} days."
        }
        chartData = {
            "bar": [
                {"name": "Current", "Workload": 80, "Team": 40},
                {"name": "Optimized", "Workload": 60, "Team": 70}
            ],
            "line": [
                {"sprint": "S1", "Risk": 80},
                {"sprint": "S2", "Risk": 60},
                {"sprint": "S3", "Risk": 30}
            ]
        }
        
    return decision, chartData
