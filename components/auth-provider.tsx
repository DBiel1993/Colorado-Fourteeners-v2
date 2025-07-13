"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { PublicClientApplication } from "@azure/msal-browser"
import { msalConfig } from "@/lib/auth-config"

interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const msalInstance = new PublicClientApplication(msalConfig)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeMsal = async () => {
      await msalInstance.initialize()
      const accounts = msalInstance.getAllAccounts()

      if (accounts.length > 0) {
        const account = accounts[0]
        setUser({
          id: account.homeAccountId,
          name: account.name || "",
          email: account.username,
          isAdmin: false, // TODO: Check admin role from claims
        })
      }

      setLoading(false)
    }

    initializeMsal()
  }, [])

  const login = async () => {
    try {
      const response = await msalInstance.loginPopup({
        scopes: ["openid", "profile", "email"],
      })

      if (response.account) {
        setUser({
          id: response.account.homeAccountId,
          name: response.account.name || "",
          email: response.account.username,
          isAdmin: false,
        })
      }
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  const logout = async () => {
    try {
      await msalInstance.logoutPopup()
      setUser(null)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
