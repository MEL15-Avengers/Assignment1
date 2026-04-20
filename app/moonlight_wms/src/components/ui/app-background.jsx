import { useEffect, useRef } from 'react'

// Subtle version of beams background for use inside the app (behind content)
export default function AppBackground() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let width, height
    const beams = []

    function resize() {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
      initBeams()
    }

    function initBeams() {
      beams.length = 0
      for (let i = 0; i < 6; i++) {
        beams.push({
          x: Math.random() * width,
          y: Math.random() * height,
          angle: Math.random() * Math.PI * 2,
          length: 200 + Math.random() * 400,
          speed: 0.0015 + Math.random() * 0.003,
          width: 0.8 + Math.random() * 1.5,
          alpha: 0.03 + Math.random() * 0.06,
          hue: 140 + Math.random() * 40,
          drift: (Math.random() - 0.5) * 0.001,
        })
      }
    }

    function drawBeam(b) {
      const x2 = b.x + Math.cos(b.angle) * b.length
      const y2 = b.y + Math.sin(b.angle) * b.length
      const grad = ctx.createLinearGradient(b.x, b.y, x2, y2)
      grad.addColorStop(0, `hsla(${b.hue}, 80%, 55%, 0)`)
      grad.addColorStop(0.5, `hsla(${b.hue}, 90%, 60%, ${b.alpha})`)
      grad.addColorStop(1, `hsla(${b.hue}, 80%, 55%, 0)`)
      ctx.beginPath()
      ctx.moveTo(b.x, b.y)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = grad
      ctx.lineWidth = b.width
      ctx.stroke()
    }

    function tick() {
      ctx.clearRect(0, 0, width, height)
      for (const b of beams) {
        b.angle += b.speed
        b.angle += b.drift
        drawBeam(b)
      }
      animRef.current = requestAnimationFrame(tick)
    }

    resize()
    tick()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => { cancelAnimationFrame(animRef.current); ro.disconnect() }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}
