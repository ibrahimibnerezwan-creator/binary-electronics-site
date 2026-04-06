'use client'

import React, { createContext, useContext } from 'react'

interface StoreSettings {
  [key: string]: string
}

const SettingsContext = createContext<StoreSettings | null>(null)

export function SettingsProvider({ 
  settings, 
  children 
}: { 
  settings: StoreSettings
  children: React.ReactNode 
}) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    // Return an empty object or some defaults if used outside provider
    // though in our app it should always be inside.
    return {} as StoreSettings
  }
  return context
}
