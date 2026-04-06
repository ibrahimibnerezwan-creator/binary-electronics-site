import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-sm text-xs font-mono uppercase tracking-widest ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 relative overflow-hidden group',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-bg-void hover:bg-primary-400 shadow-[0_0_15px_rgba(190,100,50,0.1)] hover:shadow-[0_0_25px_rgba(190,100,50,0.2)]',
        secondary: 'bg-bg-elevated text-text-primary hover:bg-bg-hover border border-primary-500/10 hover:border-primary-500/30',
        outline: 'border border-primary-500/40 bg-transparent hover:bg-primary-500/10 text-primary-500',
        ghost: 'hover:bg-primary-500/10 text-text-secondary hover:text-primary-500',
        tech: 'bg-gradient-to-r from-gold-500 to-primary-500 text-bg-void font-bold hover:brightness-110 shadow-lg shadow-primary-500/10',
        neon: 'border border-accent-500/50 bg-accent-500/5 text-accent-500 hover:bg-accent-500 hover:text-bg-void shadow-[0_0_10px_rgba(280,100,65,0.1)] hover:shadow-[0_0_20px_rgba(280,100,65,0.3)]',
      },
      size: {
        default: 'h-11 px-8 py-2',
        sm: 'h-9 px-4 text-[10px]',
        lg: 'h-14 px-12 text-sm',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
