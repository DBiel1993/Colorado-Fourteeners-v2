import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="text-center space-y-4 sm:space-y-6 py-8 sm:py-12 px-4">
      <div className="space-y-3 sm:space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
          Colorado Fourteeners
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Your comprehensive guide to conquering Colorado's 58 peaks above 14,000 feet. Plan your adventures, connect
          with the community, and explore safely.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-sm sm:max-w-none mx-auto">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/trails">Explore Trails</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
          <Link href="/search">AI Trail Search</Link>
        </Button>
      </div>
    </section>
  )
}
