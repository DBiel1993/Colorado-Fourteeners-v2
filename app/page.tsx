import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mountain, Users, MessageSquare, Search } from "lucide-react"
import Link from "next/link"
import { HeroSection } from "@/components/hero-section"

export default function HomePage() {
  return (
    <div className="space-y-12">
      <HeroSection />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mountain className="h-5 w-5" />
              Trail Guide
            </CardTitle>
            <CardDescription className="text-sm">
              Explore detailed information about Colorado's 58 fourteeners
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button asChild className="w-full">
              <Link href="/trails">Browse Trails</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              Community
            </CardTitle>
            <CardDescription className="text-sm">Connect with fellow hikers and share experiences</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/rides">Ride Shares</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/gear">Gear Shares</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5" />
              Forum
            </CardTitle>
            <CardDescription className="text-sm">Join discussions about routes, conditions, and tips</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button asChild className="w-full">
              <Link href="/forum">Join Discussion</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5" />
              AI Search
            </CardTitle>
            <CardDescription className="text-sm">Find trails using natural language search</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button asChild className="w-full">
              <Link href="/search">Smart Search</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
