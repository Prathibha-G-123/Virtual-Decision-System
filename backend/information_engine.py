def process_information(domain, data):
    info = {"domain": domain, "extracted_text": "", "complexity_level": 5, "urgency": "normal", "context_metrics": {}}
    
    if domain == 'healthcare':
        info['extracted_text'] = data.get('notes', '').lower()
        info['context_metrics'] = {
            'patient_load': int(data.get('patient_load', 50)),
            'staff_availability': int(data.get('staff_availability', 5)),
            'emergency_level': str(data.get('emergency_level', 'medium')).lower(),
            'department_type': str(data.get('department_type', 'General')).lower()
        }
    elif domain == 'business':
        info['extracted_text'] = data.get('description', '').lower()
        info['context_metrics'] = {
            'budget': float(data.get('budget', 500000)),
            'expected_revenue': float(data.get('revenue', 800000)),
            'team_size': int(data.get('team_size', 5)),
            'project_type': str(data.get('project_type', 'marketing')).lower(),
            'market_risk': str(data.get('market_risk', 'medium')).lower()
        }
    elif domain == 'project':
        info['extracted_text'] = data.get('description', '').lower()
        info['context_metrics'] = {
            'tech_stack': str(data.get('tech_stack', '')).lower(),
            'current_roles': str(data.get('current_roles', '')).lower(),
            'deadline_pressure': int(data.get('deadline_pressure', 30))
        }
        
    return info
