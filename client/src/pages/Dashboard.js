import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const statusColors = {
  applied: '#667eea', psychometric: '#f6ad55', interview: '#68d391',
  training: '#76e4f7', incubation: '#b794f4', agent: '#48bb78', rejected: '#fc8181'
};

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    API.get('/candidates').then(res => setCandidates(res.data));
  }, []);

  const counts = Object.keys(statusColors).reduce((acc, status) => {
    acc[status] = candidates.filter(c => c.status === status).length;
    return acc;
  }, {});

  return (
    <div style={{ backgroundColor:'#0f0f23', minHeight:'100vh' }}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>📊 Pipeline Dashboard</h2>
        <div style={styles.grid}>
          {Object.entries(counts).map(([status, count]) => (
            <div key={status} style={{ ...styles.card, borderTop:`4px solid ${statusColors[status]}` }}>
              <p style={styles.count}>{count}</p>
              <p style={styles.label}>{status.charAt(0).toUpperCase() + status.slice(1)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding:'2rem' },
  heading: { color:'white', marginBottom:'2rem' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:'1rem' },
  card: { backgroundColor:'#1a1a2e', borderRadius:'8px', padding:'1.5rem', textAlign:'center' },
  count: { color:'white', fontSize:'2.5rem', fontWeight:'bold', margin:0 },
  label: { color:'#a0aec0', margin:'0.5rem 0 0' }
};

export default Dashboard;