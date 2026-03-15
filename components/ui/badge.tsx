import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary-500 text-white shadow hover:opacity-80',
        secondary: 'border-transparent bg-bg-elevated text-text-primary hover:bg-bg-hover',
        destructive: 'border-transparent bg-red-500 text-white shadow hover:bg-red-600',
        outline: 'border-primary-500/30 text-primary-500',
        gold: 'border-transparent bg-accent-500 text-bg-void shadow hover:opacity-80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
