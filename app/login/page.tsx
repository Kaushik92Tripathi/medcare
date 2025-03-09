"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Reset function
  const handleReset = () => {
    setEmail("")
    setPassword("")
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* Background Image */}
      <Image
        src="/login.svg"
        alt="Login Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0"
      />

      <div className="relative z-10 w-full max-w-md p-6 border border-white/40 rounded-xl shadow-lg backdrop-blur-lg bg-white/10">
        <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>

        <p className="mb-6 text-sm text-center text-gray-500">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Sign up
          </Link>
          .
        </p>

        <form className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-500">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full h-10 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-500">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full h-10 pl-10 pr-10 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                className="absolute transform -translate-y-1/2 right-3 top-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full py-2 text-white rounded-md bg-primary hover:bg-primary/90">
            Login
          </button>
          <button type="button" onClick={handleReset} className="w-full py-2 text-white rounded-md bg-primary hover:bg-primary/90 bg-[rgb(198,176,154)]">
            Reset
          </button>
          <p className="mb-6 text-sm text-center">Forgot Password?</p>
        </form>
      </div>
    </div>
  )
}
