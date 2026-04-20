import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const neonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 disabled:opacity-50 disabled:pointer-events-none select-none overflow-hidden',
  {
    variants: {
      variant: {
        primary: [
          'bg-brand text-white rounded-lg',
          'shadow-[0_0_12px_rgba(34,197,94,0.4)]',
          'hover:shadow-[0_0_24px_rgba(34,197,94,0.6),0_0_48px_rgba(34,197,94,0.2)]',
          'hover:bg-brand-light active:scale-[0.98]',
          'before:absolute before:inset-0 before:rounded-lg before:opacity-0 hover:before:opacity-100',
          'before:bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.15),transparent_70%)]',
          'before:transition-opacity before:duration-300',
        ],
        secondary: [
          'bg-dark-700 text-gray-200 rounded-lg border border-dark-400',
          'hover:border-brand/40 hover:shadow-[0_0_16px_rgba(34,197,94,0.15)]',
          'hover:text-white active:scale-[0.98]',
        ],
        outline: [
          'bg-transparent text-brand rounded-lg border border-brand/50',
          'hover:border-brand hover:shadow-[0_0_16px_rgba(34,197,94,0.3)]',
          'hover:bg-brand/10 active:scale-[0.98]',
        ],
        ghost: [
          'bg-transparent text-gray-400 rounded-lg',
          'hover:text-white hover:bg-dark-700 active:scale-[0.98]',
        ],
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-2.5 text-base',
        xl: 'px-8 py-3 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

const NeonButton = forwardRef(({ className, variant, size, asChild = false, children, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp ref={ref} className={cn(neonVariants({ variant, size }), className)} {...props}>
      {children}
    </Comp>
  )
})
NeonButton.displayName = 'NeonButton'

export { NeonButton, neonVariants }
export default NeonButton
