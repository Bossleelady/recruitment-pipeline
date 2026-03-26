import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const InterviewSchedule = () => {
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [scheduledAt, setScheduledAt] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get('/candidates').then(res => {
      setCandidates(res.data.filter(c => c.status === 'interview' || c.status === 'psychometric'));
    });
  }, []);

  const schedule = async () => {
    try {
      await API.post(`/candidates/${selected}/interview/schedule`, {
        scheduled_at: scheduledAt,
        interviewer_id: 1
      });
      setMessage('✅ Interview scheduled! SMS sent to candidate.');
      API.get('/candidates').then(res => {
        setCandidates(res.data.filter(c => c.status === 'interview' || c.status === 'psychometric'));
      });
    } catch (err) {
      setMessage('❌ Error scheduling interview');
    }
  };

  const updateOutcome = async (id, outcome) => {
    try {
      await API.patch(`/candidates/${id}/interview/outcome`, { outcome, notes: '' });
      setMessage(`✅ Interview marked as ${outcome}`);
      API.get('/candidates').then(res => {
        setCandidates(res.data.filter(c => c.status === 'interview' || c.status === 'psychometric'));
      });
    } catch (err) {
      setMessage('❌ Error updating outcome');
    }
  };

  return (
    <div style={{ backgroundColor: '#0f0f23', minHeight: '100vh' }}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>🗓️ Interview Scheduling</h2>

        <div style={styles.card}>
          <h3 style={styles.subheading}>Schedule an Interview</h3>
          <select style={styles.input} onChange={e => setSelected(e.target.value)} defaultValue="">
            <option value="" disabled>Select a candidate</option>
            {candidates.map(c => (
              <option key={c.id} value={c.id}>{c.full_name} — {c.branch}</option>
            ))}
          </select>
          <input style={styles.input} type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} />
          <button style={styles.button} onClick={schedule}>Schedule + Send SMS</button>
          {message && <p style={styles.message}>{message}</p>}
        </div>

        <div style={styles.card}>
          <h3 style={styles.subheading}>Candidates in Interview Stage</h3>
          {candidates.length === 0 ? (
            <p style={{ color: '#a0aec0' }}>No candidates in interview stage.</p>
          ) : (
            candidates.map(c => (
              <div key={c.id} style={styles.row}>
                <span style={styles.name}>{c.full_name}</span>
                <span style={styles.branch}>{c.branch}</span>
                <button style={{ ...styles.actionBtn, backgroundColor: '#48bb78' }} onClick={() => updateOutcome(c.id, 'passed')}>✅ Passed</button>
                <button style={{ ...styles.actionBtn, backgroundColor: '#fc8181' }} onClick={() => updateOutcome(c.id, 'failed')}>❌ Failed</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem' },
  heading: { color: 'white', marginBottom: '2rem' },
  subheading: { color: 'white', marginBottom: '1rem' },
  card: { backgroundColor: '#1a1a2e', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' },
  input: { display: 'block', width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '6px', border: '1px solid #2d3748', backgroundColor: '#2d3748', color: 'white', fontSize: '1rem', boxSizing: 'border-box' },
  button: { padding: '0.75rem 1.5rem', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  message: { color: '#68d391', marginTop: '1rem' },
  row: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid #2d3748' },
  name: { color: 'white', flex: 1 },
  branch: { color: '#a0aec0', flex: 1 },
  actionBtn: { padding: '0.4rem 1rem', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
};

export default InterviewSchedule;