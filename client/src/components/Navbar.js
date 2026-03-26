import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.brand}>🏢 Recruitment Pipeline</Link>
      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/candidates" style={styles.link}>Candidates</Link>
        <span style={styles.user}>👤 {user?.name}</span>
        <button onClick={handleLogout} style={styles.button}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  nav: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 2rem', backgroundColor:'#1a1a2e', color:'white' },
  brand: { color:'white', textDecoration:'none', fontWeight:'bold', fontSize:'1.2rem' },
  links: { display:'flex', alignItems:'center', gap:'1.5rem' },
  link: { color:'#a0aec0', textDecoration:'none' },
  user: { color:'#68d391' },
  button: { backgroundColor:'#e53e3e', color:'white', border:'none', padding:'0.4rem 1rem', borderRadius:'4px', cursor:'pointer' }
};

export default Navbar;