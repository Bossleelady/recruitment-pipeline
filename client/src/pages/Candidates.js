import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const statusColors = {
  applied:'#667eea', psychometric:'#f6ad55', interview:'#68d391',
  training:'#76e4f7', incubation:'#b794f4', agent:'#48bb78', rejected:'#fc8181'
};

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/candidates').then(res => setCandidates(res.data));
  }, []);

  const filtered = filter === 'all' ? candidates : candidates.filter(c => c.status === filter);

  return (
    <div style={{ backgroundColor:'#0f0f23', minHeight:'100vh' }}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>👥 Candidates</h2>
        <select style={styles.select} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Stages</option>
          {Object.keys(statusColors).map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <table style={styles.table}>
          <thead>
            <tr>
              {['Name','Email','Phone','Branch','Status','Applied'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} style={styles.row} onClick={() => navigate(`/candidates/${c.id}`)}>
                <td style={styles.td}>{c.full_name}</td>
                <td style={styles.td}>{c.email}</td>
                <td style={styles.td}>{c.phone}</td>
                <td style={styles.td}>{c.branch}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, backgroundColor: statusColors[c.status] }}>
                    {c.status}
                  </span>
                </td>
                <td style={styles.td}>{new Date(c.applied_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { padding:'2rem' },
  heading: { color:'white', marginBottom:'1rem' },
  select: { padding:'0.5rem 1rem', borderRadius:'6px', backgroundColor:'#2d3748', color:'white', border:'none', marginBottom:'1.5rem' },
  table: { width:'100%', borderCollapse:'collapse' },
  th: { color:'#a0aec0', textAlign:'left', padding:'0.75rem', borderBottom:'1px solid #2d3748' },
  td: { color:'white', padding:'0.75rem', borderBottom:'1px solid #1a1a2e' },
  row: { cursor:'pointer', transition:'background 0.2s' },
  badge: { padding:'0.25rem 0.75rem', borderRadius:'999px', fontSize:'0.8rem', color:'white', fontWeight:'bold' }
};

export default Candidates;