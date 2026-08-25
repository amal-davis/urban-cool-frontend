import type { RefObject } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/urban-cool-logo.png'
import { HamburgerIcon, UserIcon } from '../icons/Icons'
import './Navbar.css'

function navLinkClass({ isActive }: { isActive: boolean }) {
  return `primary-nav__link${isActive ? ' is-active' : ''}`
}

interface NavbarProps {
  menuOpen: boolean
  onOpenMenu: () => void
  menuToggleRef: RefObject<HTMLButtonElement | null>
  menuId: string
}

export function Navbar({ menuOpen, onOpenMenu, menuToggleRef, menuId }: NavbarProps) {
  return (
    <header className="site-header">
      <div className="site-header__bar container">
        {/* alt="" — decorative: the link's own aria-label already carries the
            accessible name ("go to homepage"), so the image doesn't need a
            second, redundant description. No adjacent text anymore; the
            logo image (icon + wordmark baked in) is the entire brand mark. */}
        <NavLink to="/" className="brand" aria-label="Urban Cool — home">
          <img src={logo} alt="" className="brand__logo" />
        </NavLink>

        <nav className="primary-nav" aria-label="Primary">
          <ul>
            <li>
              {/* end: without it, NavLink treats every route as "active"
                  underneath "/" since all paths start with it. */}
              <NavLink to="/" end className={navLinkClass}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" className={navLinkClass}>
                Services
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={navLinkClass}>
                Contact Us
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <NavLink to="/dashboard" className="icon-button" aria-label="Account">
            <UserIcon />
          </NavLink>
          <NavLink to="/login" className="btn btn--ghost">
            Log In
          </NavLink>
          <NavLink to="/signup" className="btn btn--primary">
            Sign Up
          </NavLink>
        </div>

        <button
          ref={menuToggleRef}
          type="button"
          className="menu-toggle"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={onOpenMenu}
        >
          <HamburgerIcon />
        </button>
      </div>
    </header>
  )
}
