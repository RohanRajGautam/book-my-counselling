import Link from 'next/link'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-primary mb-4 text-6xl font-bold md:text-8xl">404</h1>
      <h2 className="mb-4 text-2xl font-semibold md:text-3xl">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or
        deleted.
      </p>
      <Link href="/">
        <Button className="cursor-pointer p-6 text-white">
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  )
}
