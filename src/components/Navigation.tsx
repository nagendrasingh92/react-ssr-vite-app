import { Link } from 'react-router-dom'

export default function Navigation() {
  return (
    <nav style={{ marginBottom: '2rem', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ marginRight: '1rem', textDecoration: 'none', color: '#646cff' }}>
        Home
      </Link>
      <Link to="/about" style={{ marginRight: '1rem', textDecoration: 'none', color: '#646cff' }}>
        About
      </Link>
      <Link to="/contact" style={{ marginRight: '1rem', textDecoration: 'none', color: '#646cff' }}>
        Contact
      </Link>
    </nav>
  )
}
