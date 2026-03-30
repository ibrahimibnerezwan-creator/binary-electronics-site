'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ShieldCheck, Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        // Redirect to dashboard
        router.push('/admin')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Invalid credentials')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-void px-4">
      <div className="absolute inset-0 bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <Card className="w-full max-w-md glass border-primary-500/20 shadow-2xl relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-accent-500" />
        
        <CardHeader className="space-y-1 pt-8 pb-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary-500/20 flex items-center justify-center text-primary-500 mb-4 border border-primary-500/20">
            <ShieldCheck size={28} />
          </div>
          <CardTitle className="text-2xl font-display font-black text-center text-gradient uppercase tracking-tight">Admin Portal</CardTitle>
          <CardDescription className="text-center text-text-secondary">
            Secure access for Binary Electronics administrators
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Admin username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-bg-elevated border-primary-500/10 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-bg-elevated border-primary-500/10 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-xs text-red-400 text-center font-bold">{error}</p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="pb-8 pt-4">
            <Button 
              type="submit" 
              className="w-full font-bold uppercase tracking-widest h-12 shadow-lg shadow-primary-500/20 group"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Login to Dashboard'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <p className="absolute bottom-8 text-xs text-text-muted">
        Binary Electronics © 2026 Admin Panel
      </p>
    </div>
  )
}
