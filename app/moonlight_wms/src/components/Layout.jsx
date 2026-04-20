import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import Sidebar from './Sidebar'
import Header from './Header'
import AppBackground from './ui/app-background'
import AIChatbot from './AIChatbot'

export default function Layout({ user, onLogout }) {
  const mainRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    if (!mainRef.current) return
    animate(mainRef.current, { opacity: [0, 1], translateY: [12, 0] }, { duration: 280, easing: 'easeOutCubic' })
    const cards = mainRef.current.querySelectorAll('.card, [data-animate]')
    if (cards.length) {
      animate(cards, { opacity: [0, 1], translateY: [16, 0] }, { delay: stagger(50, { start: 80 }), duration: 300, easing: 'easeOutCubic' })
    }
  }, [location.pathname])

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900 relative">
      <AppBackground />
      <div className="relative z-10 flex w-full h-full">
        <Sidebar user={user} onLogout={onLogout} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header user={user} />
          <main ref={mainRef} className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
      <AIChatbot user={user} />
    </div>
  )
}
