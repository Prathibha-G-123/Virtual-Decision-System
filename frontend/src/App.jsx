import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, RadialBarChart, RadialBar, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import './App.css';

// --- Global UI Components ---
const Login = () => {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/login', creds);
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/select-domain');
  };
  return (
    <div className="login-container">
      <div className="login-card glass">
        <h2>Intelligence Suite</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email Address" value={creds.email} onChange={e => setCreds({...creds, email: e.target.value})} required />
          <input type="password" placeholder="Password" value={creds.password} onChange={e => setCreds({...creds, password: e.target.value})} required />
          <button type="submit" className="login-btn">Login</button>
        </form>
        <p style={{marginTop: '1.5rem', color: '#cbd5e1', fontSize: '0.95rem'}}>
          New User? <span style={{color: '#60a5fa', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => navigate('/register')}>Register Here</span>
        </p>
      </div>
    </div>
  );
};

const Register = () => {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/register', creds);
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/select-domain');
  };
  return (
    <div className="login-container">
      <div className="login-card glass">
        <h2>System Registration</h2>
        <form onSubmit={handleRegister}>
          <input type="email" placeholder="Valid Email" value={creds.email} onChange={e => setCreds({...creds, email: e.target.value})} required />
          <input type="password" placeholder="Key Password" value={creds.password} onChange={e => setCreds({...creds, password: e.target.value})} required />
          <button type="submit" className="login-btn">Create Account</button>
        </form>
        <p style={{marginTop: '1.5rem', color: '#cbd5e1', fontSize: '0.95rem'}}>
          <span style={{color: '#60a5fa', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => navigate('/login')}>Back to System Login</span>
        </p>
      </div>
    </div>
  );
};

const SelectDomain = () => {
  const navigate = useNavigate();
  const selectRole = (role) => { localStorage.setItem('domainRole', role); navigate(`/app/${role}`); };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Domain Architectures</h1>
        <p>Specific intelligence routing layers.</p>
      </header>
      <div className="domain-grid">
        <div className="domain-card glass" onClick={() => selectRole('project')}>
          <h3>💻 Project Management</h3>
          <p>Technical architecture constraints & delay projections.</p>
        </div>
        <div className="domain-card glass" onClick={() => selectRole('healthcare')}>
          <h3>🏥 Healthcare Operations</h3>
          <p>Triage flow, active patient capacity, & trauma assignments.</p>
        </div>
        <div className="domain-card glass" onClick={() => selectRole('business')}>
          <h3>💼 Business Strategy</h3>
          <p>Capital utilization, ROI projections, & aggressive expansion tools.</p>
        </div>
      </div>
    </div>
  );
};

const LayoutWrap = ({ children, title }) => {
    const nav = useNavigate();
    return (
        <div className="app-container">
            <div className="nav-header">
                <h1>{title}</h1>
                <div>
                    <button className="nav-btn" onClick={() => nav('/select-domain')}>← Back to Domains</button>
                    <button className="nav-btn logout" onClick={() => { localStorage.clear(); nav('/login'); }}>Sign Out</button>
                </div>
            </div>
            {children}
        </div>
    )
}

// --- Specialized Independent Domain Branches ---

const HealthcareDashboard = () => {
    const [data, setData] = useState({ patient_load: 50, staff_availability: 5, emergency_level: 'medium', department_type: 'General', notes: '' });
    const [res, setRes] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
  
    const submit = async (e) => {
      e.preventDefault();
      setAnalyzing(true);
      setTimeout(async () => {
        const result = await axios.post('http://localhost:5000/api/healthcare', data);
        setRes(result.data);
        setAnalyzing(false);
      }, 1000); // 1-second simulated delay for "Analyzing..." UI state
    };

    // Live updating inputs for baseline chart before submit
    const livePie = res ? res.chartData.pie : [
       {name: "Patients", value: Number(data.patient_load) || 0, fill: "#f43f5e"},
       {name: "Staff Capacity", value: (Number(data.staff_availability) || 0) * 5, fill: "#10b981"}
    ];
    const liveRadial = res ? res.chartData.radial : [
       {name: "Input Workload", value: Math.min(100, ((data.patient_load / Math.max(1, data.staff_availability))*10) || 0), fill: "#059669"}
    ];
  
    return (
      <LayoutWrap title="🏥 Healthcare Decision Dashboard">
        <div className="main-content">
          <div className="card glass form-card" style={{borderTop: '5px solid #10b981'}}>
            <h2 style={{color: '#10b981'}}>Clinical Inputs</h2>
            <form onSubmit={submit}>
              <div style={{display:'flex', gap:'1rem', marginBottom: '1rem'}}>
                  <div style={{flex:1}}>
                      <label>Patient Load Index</label>
                      <input type="number" value={data.patient_load} onChange={e=>setData({...data, patient_load: e.target.value})} />
                  </div>
                  <div style={{flex:1}}>
                      <label>Staff Capacity (Count)</label>
                      <input type="number" value={data.staff_availability} onChange={e=>setData({...data, staff_availability: e.target.value})} />
                  </div>
              </div>
              <div style={{display:'flex', gap:'1rem', marginBottom: '1rem'}}>
                  <div style={{flex:1}}>
                      <label>Target Emergency Level</label>
                      <input type="text" placeholder="low, medium, high" value={data.emergency_level} onChange={e=>setData({...data, emergency_level: e.target.value})} />
                  </div>
                  <div style={{flex:1}}>
                      <label>Ward / Department Type</label>
                      <input type="text" placeholder="ICU, ER, General" value={data.department_type} onChange={e=>setData({...data, department_type: e.target.value})} />
                  </div>
              </div>
              <label>Additional Observational Notes</label>
              <textarea rows="3" className="context-textarea" value={data.notes} onChange={e=>setData({...data, notes: e.target.value})} />
              <button className="submit-btn" style={{background: '#059669', boxShadow: 'none'}} type="submit" disabled={analyzing}>
                {analyzing ? '🧠 Analyzing Operations...' : 'Run Triage Diagnostics'}
              </button>
            </form>
          </div>
          
          <div className="card glass result-card fadeInUp" style={{gridColumn: '1 / -1', borderTop: '5px solid #10b981'}}>
            
            {res && !analyzing ? (
              <>
                <h3 className={`stat-value ${res.decision.risk_level.toLowerCase()}`}>System Risk Level: {res.decision.risk_level}</h3>
                <p style={{background: 'rgba(16,185,129,0.1)', padding:'1rem', borderRadius:'8px', color:'#34d399'}}>
                   Priority Handling Strategy: <strong>{res.decision.priority_strategy}</strong>
                </p>
                <ul className="strategy-list" style={{marginTop:'1.5rem', marginBottom: '1rem'}}>
                   {res.decision.final_recommendations.map((r,i) => <li key={i}>{r}</li>)}
                </ul>
              </>
            ) : (
                <div style={{textAlign:'center', padding: '1rem', color: '#94a3b8'}}>
                   <h3>{analyzing ? 'Processing Network Decisions...' : 'Live Model Projections Baseline'}</h3>
                </div>
            )}
            
            <div style={{display:'flex', gap: '2rem', height: 300, padding: '2rem', background: 'rgba(15,23,42,0.8)', borderRadius:'16px', opacity: analyzing ? 0.3 : 1, transition: '0.3s'}}>
               <ResponsiveContainer width="50%" height="100%">
                 <PieChart>
                   <Pie data={livePie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} label>
                     {livePie.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                   </Pie>
                   <Tooltip contentStyle={{background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)'}} />
                   <Legend verticalAlign="bottom" height={36}/>
                 </PieChart>
               </ResponsiveContainer>

               <ResponsiveContainer width="50%" height="100%">
                 <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="100%" barSize={20} data={liveRadial} startAngle={180} endAngle={0}>
                    <RadialBar minAngle={15} background clockWise dataKey="value" />
                    <Tooltip contentStyle={{background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)'}} />
                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                 </RadialBarChart>
               </ResponsiveContainer>
            </div>
          </div>
        </div>
      </LayoutWrap>
    );
};

const BusinessDashboard = () => {
    const [data, setData] = useState({ budget: 500000, revenue: 800000, team_size: 5, project_type: 'marketing', market_risk: 'medium', description: '' });
    const [res, setRes] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
  
    const submit = async (e) => {
      e.preventDefault();
      setAnalyzing(true);
      setTimeout(async () => {
        const result = await axios.post('http://localhost:5000/api/business', data);
        setRes(result.data);
        setAnalyzing(false);
      }, 1000);
    };

    const liveBar = res ? res.chartData.bar : [{"name": "Live Input Forecast", "Budget": data.budget||0, "Revenue": data.revenue||0}];
    const liveLine = res ? res.chartData.line : [
        {"month": "M1", "ROI": 0}, {"month": "M2", "ROI": 5}, {"month": "M3", "ROI": 10}, {"month": "M4", "ROI": (((data.revenue - data.budget)/Math.max(1, data.budget))*100)||0}
    ];
  
    return (
      <LayoutWrap title="💼 Business Intelligence Dashboard">
        <div className="main-content">
          <div className="card glass form-card" style={{borderTop: '5px solid #475569'}}>
            <h2 style={{color: '#94a3b8'}}>Financial Vectors</h2>
            <form onSubmit={submit}>
              <div style={{display:'flex', gap:'1rem', marginBottom: '1rem'}}>
                  <div style={{flex:1}}>
                      <label>Capital Budget ($)</label>
                      <input type="number" value={data.budget} onChange={e=>setData({...data, budget: e.target.value})} />
                  </div>
                  <div style={{flex:1}}>
                      <label>Expected Target Revenue ($)</label>
                      <input type="number" value={data.revenue} onChange={e=>setData({...data, revenue: e.target.value})} />
                  </div>
              </div>
              <div style={{display:'flex', gap:'1rem', marginBottom: '1rem'}}>
                  <div style={{flex:1}}>
                      <label>Core Team Size</label>
                      <input type="number" value={data.team_size} onChange={e=>setData({...data, team_size: e.target.value})} />
                  </div>
                  <div style={{flex:1}}>
                      <label>Project Matrix Type</label>
                      <input type="text" value={data.project_type} onChange={e=>setData({...data, project_type: e.target.value})} />
                  </div>
              </div>
              <label>Market Risk Extrapolation</label>
              <input type="text" placeholder="low, medium, high" value={data.market_risk} onChange={e=>setData({...data, market_risk: e.target.value})} />
              <label>Strategic Intent Overview</label>
              <textarea rows="3" className="context-textarea" value={data.description} onChange={e=>setData({...data, description: e.target.value})} />
              <button className="submit-btn" style={{background: '#475569', boxShadow: 'none'}} type="submit" disabled={analyzing}>
                {analyzing ? '🧠 Auditing Capital...' : 'Execute Financial Audit'}
              </button>
            </form>
          </div>
  
          <div className="card glass result-card fadeInUp" style={{gridColumn: '1 / -1', borderTop: '5px solid #475569'}}>
            
            {res && !analyzing ? (
              <>
                <h3 className={`stat-value ${res.decision.risk_level.toLowerCase()}`}>Investment Risk Profile: {res.decision.risk_level}</h3>
                <p style={{background: 'rgba(255,255,255,0.05)', padding:'1rem', borderRadius:'8px'}}>
                   Budget Optimization Strategy: <strong>{res.decision.budget_optimization}</strong>
                </p>
                <ul className="strategy-list" style={{marginTop:'1.5rem', marginBottom: '1rem'}}>
                   {res.decision.final_recommendations.map((r,i) => <li key={i}>{r}</li>)}
                </ul>
              </>
            ) : (
                <div style={{textAlign:'center', padding: '1rem', color: '#94a3b8'}}>
                   <h3>{analyzing ? 'Analyzing Yield...' : 'Live Model Projections Baseline'}</h3>
                </div>
            )}
            
            <div style={{display:'flex', flexDirection: 'row', gap:'2rem', height: 280, marginTop: '2rem', padding: '2rem', background: 'rgba(15,23,42,0.8)', borderRadius:'16px', opacity: analyzing ? 0.3 : 1, transition: '0.3s'}}>
               <ResponsiveContainer width="50%" height="100%">
                 <BarChart data={liveBar}>
                   <XAxis dataKey="name" stroke="#94a3b8" />
                   <YAxis stroke="#475569" />
                   <Tooltip contentStyle={{background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)'}} />
                   <Legend verticalAlign="top" height={30} />
                   <Bar dataKey="Budget" fill="#f43f5e" radius={[4,4,0,0]} />
                   <Bar dataKey="Revenue" fill="#10b981" radius={[4,4,0,0]} />
                 </BarChart>
               </ResponsiveContainer>
               
               <ResponsiveContainer width="50%" height="100%">
                 <LineChart data={liveLine}>
                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                   <XAxis dataKey="month" stroke="#94a3b8" />
                   <YAxis stroke="#475569" />
                   <Tooltip contentStyle={{background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)'}} />
                   <Legend verticalAlign="top" height={30} />
                   <Line type="monotone" dataKey="ROI" name="Projected ROI %" stroke="#3b82f6" strokeWidth={4} activeDot={{r: 6}} />
                 </LineChart>
               </ResponsiveContainer>
            </div>
          </div>
        </div>
      </LayoutWrap>
    );
};

const ProjectDashboard = () => {
    const [data, setData] = useState({ name: '', description: '', tech_stack: '', current_roles: '', deadline_pressure: 30 });
    const [res, setRes] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
  
    const submit = async (e) => {
      e.preventDefault();
      setAnalyzing(true);
      setTimeout(async () => {
        const result = await axios.post('http://localhost:5000/api/project', data);
        setRes(result.data);
        setAnalyzing(false);
      }, 1000);
    };

    const liveBar = res ? res.chartData.bar : [{"name": "Current Constraints", "Workload": 50, "Team": 20}];
    const liveLine = res ? res.chartData.line : [
        {"sprint": "S1", "Risk": 50}, {"sprint": "S2", "Risk": 50}, {"sprint": "S3", "Risk": 50}
    ];
  
    return (
      <LayoutWrap title="💻 Technical PM Dashboard">
        <div className="main-content">
          <div className="card glass form-card" style={{borderTop: '5px solid #3b82f6'}}>
            <h2 style={{color: '#60a5fa'}}>Engineering Inputs</h2>
            <form onSubmit={submit}>
              <label>Target Project Name</label>
              <input type="text" placeholder="e.g. Codebase Migration" value={data.name} onChange={e=>setData({...data, name: e.target.value})} style={{marginBottom: '1rem'}} />
              <label>Detailed Architecture Description</label>
              <textarea rows="4" className="context-textarea" value={data.description} onChange={e=>setData({...data, description: e.target.value})} />
              <div style={{display:'flex', gap:'1rem', marginBottom: '1rem'}}>
                  <div style={{flex:1}}>
                      <label>Tech Stack Specifications</label>
                      <input type="text" placeholder="e.g. MERN, Postgres" value={data.tech_stack} onChange={e=>setData({...data, tech_stack: e.target.value})} />
                  </div>
                  <div style={{flex:1}}>
                      <label>Deadline Pressure (Days)</label>
                      <input type="number" value={data.deadline_pressure} onChange={e=>setData({...data, deadline_pressure: e.target.value})} />
                  </div>
              </div>
              <label>Current Deployment Roles Active</label>
              <input type="text" placeholder="e.g. 2 Frontend, 1 PM" value={data.current_roles} onChange={e=>setData({...data, current_roles: e.target.value})} />
              <button className="submit-btn" style={{background: '#2563eb', boxShadow: 'none'}} type="submit" disabled={analyzing}>
                {analyzing ? '🧠 Synthesizing Workload...' : 'Compile Structuring'}
              </button>
            </form>
          </div>
  
          <div className="card glass result-card fadeInUp" style={{gridColumn: '1 / -1', borderTop: '5px solid #3b82f6'}}>
            
            {res && !analyzing ? (
              <>
                <h3 className={`stat-value ${res.decision.risk_level.toLowerCase()}`}>Architecture Risk: {res.decision.risk_level}</h3>
                <p style={{background: 'rgba(59,130,246,0.1)', padding:'1rem', borderRadius:'8px', color: '#93c5fd'}}>
                   Timeline Buffer Rule: <strong>{res.decision.timeline_adjustment}</strong>
                </p>
                <ul className="strategy-list" style={{marginTop:'1.5rem', marginBottom: '1rem'}}>
                   {res.decision.final_recommendations.map((r,i) => <li key={i}>{r}</li>)}
                </ul>
              </>
            ) : (
                <div style={{textAlign:'center', padding: '1rem', color: '#94a3b8'}}>
                   <h3>{analyzing ? 'Running ML Inference...' : 'Live Model Projections Baseline'}</h3>
                </div>
            )}
            
            <div style={{display:'flex', flexDirection: 'row', gap:'2rem', height: 280, marginTop: '2rem', padding: '2rem', background: 'rgba(15,23,42,0.8)', borderRadius:'16px', opacity: analyzing ? 0.3 : 1, transition: '0.3s'}}>
               <ResponsiveContainer width="50%" height="100%">
                 <BarChart data={liveBar}>
                   <XAxis dataKey="name" stroke="#94a3b8" />
                   <YAxis stroke="#475569" />
                   <Tooltip contentStyle={{background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)'}} />
                   <Legend verticalAlign="top" height={30} />
                   <Bar dataKey="Workload" fill="#f59e0b" radius={[4,4,0,0]} />
                   <Bar dataKey="Team" fill="#3b82f6" radius={[4,4,0,0]} />
                 </BarChart>
               </ResponsiveContainer>
               
               <ResponsiveContainer width="50%" height="100%">
                 <LineChart data={liveLine}>
                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                   <XAxis dataKey="sprint" stroke="#94a3b8" />
                   <YAxis stroke="#475569" />
                   <Tooltip contentStyle={{background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)'}} />
                   <Legend verticalAlign="top" height={30} />
                   <Line type="monotone" dataKey="Risk" name="Predicted Risk Down-Curve" stroke="#8b5cf6" strokeWidth={4} activeDot={{r: 6}} />
                 </LineChart>
               </ResponsiveContainer>
            </div>
          </div>
        </div>
      </LayoutWrap>
    );
};

const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  const role = localStorage.getItem('domainRole');
  const path = window.location.pathname;

  if (!isAuth) return <Navigate to="/login" />;
  if (!role && path.includes('/app/')) return <Navigate to="/select-domain" />;
  if (role && path.includes('/app/') && !path.includes(role)) return <Navigate to={`/app/${role}`} />;

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/select-domain" element={<ProtectedRoute><SelectDomain /></ProtectedRoute>} />
        <Route path="/app/project" element={<ProtectedRoute><ProjectDashboard /></ProtectedRoute>} />
        <Route path="/app/healthcare" element={<ProtectedRoute><HealthcareDashboard /></ProtectedRoute>} />
        <Route path="/app/business" element={<ProtectedRoute><BusinessDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
