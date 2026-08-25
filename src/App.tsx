import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar/Navbar'
import { MobileMenu } from './components/Navbar/MobileMenu'
import { MobileBottomNav } from './components/MobileBottomNav/MobileBottomNav'
import { Footer } from './components/Footer/Footer'
import { PageTransitionSpinner } from './components/PageTransitionSpinner/PageTransitionSpinner'
import { HomePageSkeleton } from './pages/skeletons/HomePageSkeleton'
import { ServicesPageSkeleton } from './pages/skeletons/ServicesPageSkeleton'
import { ServiceDetailPageSkeleton } from './pages/skeletons/ServiceDetailPageSkeleton'
import { BookingPageSkeleton } from './pages/skeletons/BookingPageSkeleton'
import { ServiceTrackingPageSkeleton } from './pages/skeletons/ServiceTrackingPageSkeleton'
import { ContactPageSkeleton } from './pages/skeletons/ContactPageSkeleton'
import { LoginPageSkeleton } from './pages/skeletons/LoginPageSkeleton'
import { SignupPageSkeleton } from './pages/skeletons/SignupPageSkeleton'
import { DashboardPageSkeleton } from './pages/skeletons/DashboardPageSkeleton'

// Lazy-loaded, one JS chunk per page: the skeleton fallbacks below only
// show while the browser is genuinely fetching that chunk (first visit to
// a route in a session; instant on repeat visits, since it's cached) —
// not a fabricated delay. Splitting also means Home doesn't ship Services'
// and Contact's code until they're actually visited.
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })))
const ServicesPage = lazy(() => import('./pages/ServicesPage').then((m) => ({ default: m.ServicesPage })))
const ServiceDetailPage = lazy(() =>
  import('./pages/ServiceDetailPage').then((m) => ({ default: m.ServiceDetailPage })),
)
const BookingPage = lazy(() => import('./pages/BookingPage').then((m) => ({ default: m.BookingPage })))
const ServiceTrackingPage = lazy(() =>
  import('./pages/ServiceTrackingPage').then((m) => ({ default: m.ServiceTrackingPage })),
)
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const SignupPage = lazy(() => import('./pages/SignupPage').then((m) => ({ default: m.SignupPage })))
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))

const MOBILE_MENU_ID = 'mobile-menu'

/** React Router doesn't reset scroll position between routes on its own —
 *  without this, navigating Home -> Contact would leave the viewport
 *  wherever it happened to be scrolled to on the previous page.
 *  `behavior: 'instant'` is deliberate — index.css now sets `scroll-
 *  behavior: smooth` globally (for anchor links), which `window.scrollTo`
 *  would otherwise inherit; smooth-scrolling while the page's content is
 *  also being swapped underneath it looks janky, not smooth. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuToggleRef = useRef<HTMLButtonElement>(null)

  function closeMenu() {
    setMenuOpen(false)
    // Return focus to the control that opened the menu.
    menuToggleRef.current?.focus()
  }

  return (
    <>
      <ScrollToTop />
      <PageTransitionSpinner />

      {/* Everything except the mobile menu itself lives here, so marking
          this inert while the menu is open can't also inert the menu. */}
      <div id="page-root" inert={menuOpen}>
        <Navbar
          menuOpen={menuOpen}
          onOpenMenu={() => setMenuOpen(true)}
          menuToggleRef={menuToggleRef}
          menuId={MOBILE_MENU_ID}
        />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <Suspense fallback={<HomePageSkeleton />}>
                  <HomePage />
                </Suspense>
              }
            />
            <Route
              path="/services"
              element={
                <Suspense fallback={<ServicesPageSkeleton />}>
                  <ServicesPage />
                </Suspense>
              }
            />
            <Route
              path="/service/:serviceId"
              element={
                <Suspense fallback={<ServiceDetailPageSkeleton />}>
                  <ServiceDetailPage />
                </Suspense>
              }
            />
            <Route
              path="/booking/:serviceId"
              element={
                <Suspense fallback={<BookingPageSkeleton />}>
                  <BookingPage />
                </Suspense>
              }
            />
            <Route
              path="/track/:bookingId"
              element={
                <Suspense fallback={<ServiceTrackingPageSkeleton />}>
                  <ServiceTrackingPage />
                </Suspense>
              }
            />
            <Route
              path="/contact"
              element={
                <Suspense fallback={<ContactPageSkeleton />}>
                  <ContactPage />
                </Suspense>
              }
            />
            <Route
              path="/login"
              element={
                <Suspense fallback={<LoginPageSkeleton />}>
                  <LoginPage />
                </Suspense>
              }
            />
            <Route
              path="/signup"
              element={
                <Suspense fallback={<SignupPageSkeleton />}>
                  <SignupPage />
                </Suspense>
              }
            />
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<DashboardPageSkeleton />}>
                  <DashboardPage />
                </Suspense>
              }
            />
          </Routes>
        </main>

        <Footer />
        <MobileBottomNav />
      </div>

      <MobileMenu id={MOBILE_MENU_ID} open={menuOpen} onClose={closeMenu} />
    </>
  )
}

export default App
