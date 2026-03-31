'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ShinyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
}

export default function ShinyButton({
  className,
  children = 'Shiny Day',
  ...props
}: ShinyButtonProps) {
  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold rounded-xl text-primary-foreground bg-primary overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
