import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const Incubation = () => {
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState('');
  const [day, setDay] = useState(1);
  const [sales, setSales] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get('/candidates').then(res => {
      setCandidates(res.data.filter(c => c.status === 'incubation'));
    });
  }, []);

  const logDay = async () => {
    try {
      const res = await API.post(`/candidates/${selected}/incubation`, {
        day: parseInt(day),
        sales_count: parseInt(sales)
      });
      const status = res.data.target_met ? '✅ Target met!' : '❌ Target not met';
      setMessage(`Day ${day} logged. Sales: ${sales}. ${status}`);
    } catch (err) {
      setMessage('❌ Error logging day');
    }
  };

  return (
    <div style={{ backgroundColor: '#0f0f23', minHeight: '100vh' }}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>🔥 Incubation Tracker</h2>

        <div style={styles.card}>
          <h3 style={styles.subheading}>Log Daily Sales</h3>
          <p style={{ color: '#a0aec0', marginBottom: '1rem' }}>Target: 3 sales per day for 5 days to become an agent</p>

          <select style={styles.input} value={selected} onChange={e => setSelected(e.target.value)}>
            <option value="" disabled>Select candidate</option>
            {candidates.map(c => (
              <option key={c.id} value={c.id}>{c.full_name} — {c.branch}</option>
            ))}
          </select>

          <select style={styles.input} value={day} onChange={e => setDay(e.target.value)}>
            {[1,2,3,4,5].map(d => <option key={d} value={d}>Day {d}</option>)}
          </select>

          <input style={styles.input} type="number" placeholder="Sales count" value={sales} onChange={e => setSales(e.target.value)} min="0" />

          <button style={styles.button} onClick={logDay}>Log Day</button>
          {message && <p style={styles.message}>{message}</p>}
        </div>

        <div style={styles.card}>
          <h3 style={styles.subheading}>Candidates in Incubation</h3>
          {candidates.length === 0 ? (
            <p style={{ color: '#a0aec0' }}>No candidates in incubation.</p>
          ) : (
            candidates.map(c => (
              <div key={c.id} style={styles.row}>
                <span style={styles.name}>{c.full_name}</span>
                <span style={styles.branch}>{c.branch}</span>
                <span style={{ ...styles.badge, backgroundColor: '#b794f4' }}>Incubation</span>
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
  button: { padding: '0.75rem 1.5rem', backgroundColor: '#b794f4', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  message: { color: '#68d391', marginTop: '1rem' },
  row: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid #2d3748' },
  name: { color: 'white', flex: 1 },
  branch: { color: '#a0aec0', flex: 1 },
  badge: { padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', color: 'white', fontWeight: 'bold' }
};

export default Incubation;