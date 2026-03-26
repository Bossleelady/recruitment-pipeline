import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const CandidateDetail = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [score, setScore] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get(`/candidates/${id}`).then(res => setCandidate(res.data));
  }, [id]);

  const submitPsychometric = async () => {
    try {
      const res = await API.post(`/candidates/${id}/psychometric`, { score: parseInt(score) });
      setMessage(`Score: ${res.data.score} — ${res.data.passed ? '✅ Passed' : '❌ Failed'} — Status: ${res.data.status}`);
      API.get(`/candidates/${id}`).then(res => setCandidate(res.data));
    } catch (err) {
      setMessage('Error submitting score');
    }
  };

  if (!candidate) return <div style={{ color:'white', padding:'2rem' }}>Loading...</div>;

  return (
    <div style={{ backgroundColor:'#0f0f23', minHeight:'100vh' }}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>👤 {candidate.full_name}</h2>
        <div style={styles.card}>
          <p style={styles.info}><strong>Email:</strong> {candidate.email}</p>
          <p style={styles.info}><strong>Phone:</strong> {candidate.phone}</p>
          <p style={styles.info}><strong>Branch:</strong> {candidate.branch}</p>
          <p style={styles.info}><strong>Status:</strong> <span style={styles.badge}>{candidate.status}</span></p>
          <p style={styles.info}><strong>Applied:</strong> {new Date(candidate.applied_at).toLocaleDateString()}</p>
        </div>

        {candidate.status === 'applied' && (
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>📝 Submit Psychometric Score</h3>
            <input style={styles.input} type="number" placeholder="Score (0-100)" value={score} onChange={e => setScore(e.target.value)} />
            <button style={styles.button} onClick={submitPsychometric}>Submit Score</button>
            {message && <p style={styles.message}>{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding:'2rem' },
  heading: { color:'white', marginBottom:'1.5rem' },
  card: { backgroundColor:'#1a1a2e', borderRadius:'8px', padding:'1.5rem', marginBottom:'1.5rem' },
  info: { color:'#a0aec0', marginBottom:'0.5rem' },
  badge: { backgroundColor:'#667eea', color:'white', padding:'0.2rem 0.75rem', borderRadius:'999px', fontSize:'0.85rem' },
  sectionTitle: { color:'white', marginBottom:'1rem' },
  input: { padding:'0.75rem', borderRadius:'6px', border:'1px solid #2d3748', backgroundColor:'#2d3748', color:'white', marginRight:'1rem', width:'200px' },
  button: { padding:'0.75rem 1.5rem', backgroundColor:'#667eea', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold' },
  message: { color:'#68d391', marginTop:'1rem' }
};

export default CandidateDetail;