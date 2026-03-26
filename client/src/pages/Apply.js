import { useState } from 'react';
import API from '../api/axios';

const Apply = () => {
  const [form, setForm] = useState({ full_name:'', email:'', phone:'', branch:'' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/candidates/apply', form);
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  if (submitted) return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.success}>✅ Application Submitted!</h2>
        <p style={styles.subtitle}>We'll be in touch soon.</p>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🏢 Apply Now</h1>
        <p style={styles.subtitle}>Fill in your details to apply</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {['full_name','email','phone','branch'].map(field => (
            <input key={field} style={styles.input} placeholder={field.replace('_',' ').replace(/\b\w/g, l => l.toUpperCase())}
              value={form[field]} onChange={e => setForm({...form, [field]: e.target.value})} required />
          ))}
          <button style={styles.button} type="submit">Submit Application</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#0f0f23' },
  card: { backgroundColor:'#1a1a2e', padding:'2.5rem', borderRadius:'12px', width:'100%', maxWidth:'400px' },
  title: { color:'white', textAlign:'center', marginBottom:'0.5rem' },
  subtitle: { color:'#a0aec0', textAlign:'center', marginBottom:'2rem' },
  input: { width:'100%', padding:'0.75rem', marginBottom:'1rem', borderRadius:'6px', border:'1px solid #2d3748', backgroundColor:'#2d3748', color:'white', fontSize:'1rem', boxSizing:'border-box' },
  button: { width:'100%', padding:'0.75rem', backgroundColor:'#48bb78', color:'white', border:'none', borderRadius:'6px', fontSize:'1rem', cursor:'pointer', fontWeight:'bold' },
  error: { color:'#fc8181', textAlign:'center', marginBottom:'1rem' },
  success: { color:'#68d391', textAlign:'center' }
};

export default Apply;