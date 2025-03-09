import Link from "next/link"

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
              <svg
                className="w-6 h-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-primary">MedCare</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-500 hover:text-primary">
              Home
            </Link>
            <Link href="/appointments" className="text-gray-500 hover:text-primary">
              Appointments
            </Link>
            <Link href="/blog" className="text-gray-500 hover:text-primary">
              Health Blog
            </Link>
            <Link href="/reviews" className="text-gray-500 hover:text-primary">
              Reviews
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-gray-50">
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-medium text-white rounded-md bg-primary hover:bg-primary/90"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  )
}

