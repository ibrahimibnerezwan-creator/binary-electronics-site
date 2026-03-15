import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/20',
        secondary: 'bg-bg-elevated text-text-primary hover:bg-bg-hover border border-primary-500/10 hover:border-primary-500/30',
        outline: 'border border-primary-500/40 bg-transparent hover:bg-primary-500/10 text-primary-500',
        ghost: 'hover:bg-primary-500/10 text-text-secondary hover:text-primary-500',
        gold: 'bg-gradient-to-r from-accent-400 to-accent-500 text-bg-void font-bold hover:brightness-110 shadow-lg shadow-accent-500/20',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 px-4',
        lg: 'h-14 px-10 text-base',
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
        ...props
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
