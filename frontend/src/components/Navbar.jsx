import { Link } from 'react-router-dom'
import '../styles/navbar.css'

// Header minimal: identitas produk saja karena aplikasi hanya memiliki satu halaman.
export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="Steam Sentiment Analyzer — beranda">
          <span className="navbar__logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h4l3 8 4-16 3 8h4" />
            </svg>
          </span>
          <span className="navbar__name">
            Steam Sentiment <span className="navbar__brand-accent">Analyzer</span>
          </span>
        </Link>
      </div>
    </header>
  )
}
