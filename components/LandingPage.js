"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle, Users, Zap, Eye, LayoutGrid } from "lucide-react"

export default function LandingPage() {
  const features = [
    {
      icon: <LayoutGrid className="h-6 w-6" />,
      title: "Visual Workflow",
      description: "Organize tasks with intuitive drag-and-drop columns and cards",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Real-time Collaboration",
      description: "Work together seamlessly with live updates and instant synchronization",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Built for speed with modern technology and optimized performance",
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Clean Interface",
      description: "Focus on what matters with a distraction-free, intuitive design",
    },
  ]

  const benefits = [
    "Unlimited boards and projects",
    "Real-time team collaboration",
    "Drag-and-drop task management",
    "Mobile-responsive design",
    "Secure cloud storage",
    "Multiple authentication options",
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <LayoutGrid className="h-4 w-4" />
              </div>
              <span className="font-bold text-xl text-gray-900">Kanban.joemilburn</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#benefits" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Benefits
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative py-24 sm:py-32">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Organize Your Work with{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Visual Kanban
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                Transform your team&apos;s productivity with our intuitive Kanban board platform. Visualize workflows,
                collaborate in real-time, and deliver projects faster than ever.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Link
                  href="/login"
                  className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors flex items-center gap-2"
                >
                  Start Free Today
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg border border-gray-300 px-6 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </Link>
              </div>
              <p className="mt-4 text-sm text-gray-500">No credit card required • Free forever</p>
            </div>

            {/* Hero Image/Demo */}
            <div className="mt-16 flow-root sm:mt-24">
              <div className="relative rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4">
                <div className="rounded-md bg-white p-4 shadow-2xl ring-1 ring-gray-900/10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <div className="ml-4 text-sm text-gray-500">kanban-saas.com</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Mock Kanban Columns */}
                    <div className="space-y-2">
                      <div className="bg-gray-100 rounded p-2 text-xs font-medium">To Do</div>
                      <div className="bg-white border rounded p-2 text-xs">Design new feature</div>
                      <div className="bg-white border rounded p-2 text-xs">User research</div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-blue-100 rounded p-2 text-xs font-medium">In Progress</div>
                      <div className="bg-white border rounded p-2 text-xs">Build landing page</div>
                      <div className="bg-white border rounded p-2 text-xs">API integration</div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-green-100 rounded p-2 text-xs font-medium">Done</div>
                      <div className="bg-white border rounded p-2 text-xs">Setup database</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to stay organized
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful features designed to help teams collaborate and deliver results
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto h-12 w-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Why teams choose our platform
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Join thousands of teams who have transformed their workflow with our intuitive Kanban solution.
              </p>

              <div className="mt-8 space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Get Started Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 p-8">
                <div className="h-full w-full rounded-xl bg-white shadow-xl p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                        K
                      </div>
                      <span className="font-semibold">Project Dashboard</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">24</div>
                        <div className="text-xs text-gray-600">Active Tasks</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3 text-center">
                        <div className="text-2xl font-bold text-green-600">12</div>
                        <div className="text-xs text-gray-600">Completed</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs">🚀 Launch new feature</div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs">
                        📊 Analyze user feedback
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded p-2 text-xs">
                        ✅ Update documentation
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your workflow?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Join thousands of teams already using our platform to deliver better results.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/login"
                className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                Start Your Free Account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-4 text-sm text-blue-200">No setup fees • Cancel anytime • 30-day free trial</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-blue-600 text-white flex items-center justify-center">
                <LayoutGrid className="h-3 w-3" />
              </div>
              <span className="font-semibold text-white">Kanban.joemilburn</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                Get Started
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2025 Joe Milburn. Built with modern web technologies for teams that ship fast.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
