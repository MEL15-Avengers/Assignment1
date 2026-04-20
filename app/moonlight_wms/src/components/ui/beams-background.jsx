import { useEffect, useRef } from 'react'
import { cn } from '../../lib/utils'

export default function BeamsBackground({ className, intensity = 'default' }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let width, height

    const beamCount = intensity === 'strong' ? 12 : 8
    const beams = []

    function resize() {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    function initBeams() {
      beams.length = 0
      for (let i = 0; i < beamCount; i++) {
        beams.push({
          x: Math.random() * width,
          y: Math.random() * height,
          angle: Math.random() * Math.PI * 2,
          length: 150 + Math.random() * 300,
          speed: 0.003 + Math.random() * 0.006,
          width: 1 + Math.random() * 2.5,
          alpha: 0.08 + Math.random() * 0.18,
          hue: 140 + Math.random() * 40,
          drift: (Math.random() - 0.5) * 0.002,
        })
      }
    }

    function drawBeam(b) {
      const x2 = b.x + Math.cos(b.angle) * b.length
      const y2 = b.y + Math.sin(b.angle) * b.length
      const grad = ctx.createLinearGradient(b.x, b.y, x2, y2)
      grad.addColorStop(0, `hsla(${b.hue}, 80%, 55%, 0)`)
      grad.addColorStop(0.4, `hsla(${b.hue}, 90%, 60%, ${b.alpha})`)
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
      ctx.fillStyle = '#0d1117'
      ctx.fillRect(0, 0, width, height)

      // Radial overlay
      const radial = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * 0.7)
      radial.addColorStop(0, 'rgba(34,197,94,0.04)')
      radial.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = radial
      ctx.fillRect(0, 0, width, height)

      for (const b of beams) {
        b.angle += b.speed
        b.angle += b.drift
        drawBeam(b)
      }
      animRef.current = requestAnimationFrame(tick)
    }

    resize()
    initBeams()
    tick()

    const ro = new ResizeObserver(() => { resize(); initBeams() })
    ro.observe(canvas)
    return () => { cancelAnimationFrame(animRef.current); ro.disconnect() }
  }, [intensity])

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 w-full h-full', className)}
      style={{ display: 'block' }}
    />
  )
}
