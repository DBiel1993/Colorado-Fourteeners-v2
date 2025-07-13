"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Mountain, User } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Trails", href: "/trails" },
  { name: "Rides", href: "/rides" },
  { name: "Gear", href: "/gear" },
  { name: "Forum", href: "/forum" },
  { name: "Search", href: "/search" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, login, logout, isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Mountain className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="font-bold text-sm sm:text-base">Colorado 14ers</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="hidden md:flex">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user?.name || "User"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                {user?.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={login} size="sm" className="hidden md:flex">
              Sign In
            </Button>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 pb-6 border-b">
                  <Mountain className="h-6 w-6" />
                  <span className="font-bold text-lg">Colorado 14ers</span>
                </div>
                <nav className="flex flex-col gap-1 mt-6 flex-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium transition-colors hover:text-primary p-3 rounded-md ${
                        pathname === item.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="pt-6 border-t">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-md hover:bg-accent text-lg"
                      >
                        <User className="h-5 w-5" />
                        Profile
                      </Link>
                      {user?.isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-md hover:bg-accent text-lg"
                        >
                          Admin
                        </Link>
                      )}
                      <Button onClick={logout} variant="outline" className="w-full mt-4 bg-transparent">
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={login} className="w-full">
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
