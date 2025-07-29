'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider 
      {...props} 
      forcedTheme="light" 
      defaultTheme="light" 
      theme="light"
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  )
}
