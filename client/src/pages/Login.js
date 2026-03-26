import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🏢 Recruitment Pipeline</h1>
        <p style={styles.subtitle}>Sign in to your account</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button style={styles.button} type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#0f0f23' },
  card: { backgroundColor:'#1a1a2e', padding:'2.5rem', borderRadius:'12px', width:'100%', maxWidth:'400px', boxShadow:'0 4px 20px rgba(0,0,0,0.5)' },
  title: { color:'white', textAlign:'center', marginBottom:'0.5rem' },
  subtitle: { color:'#a0aec0', textAlign:'center', marginBottom:'2rem' },
  input: { width:'100%', padding:'0.75rem', marginBottom:'1rem', borderRadius:'6px', border:'1px solid #2d3748', backgroundColor:'#2d3748', color:'white', fontSize:'1rem', boxSizing:'border-box' },
  button: { width:'100%', padding:'0.75rem', backgroundColor:'#667eea', color:'white', border:'none', borderRadius:'6px', fontSize:'1rem', cursor:'pointer', fontWeight:'bold' },
  error: { color:'#fc8181', textAlign:'center', marginBottom:'1rem' }
};

export default Login;