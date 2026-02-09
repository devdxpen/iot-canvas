import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, Cpu, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <Cpu size={24} />
          <span>IoT Portal</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
          <Link href="#" className="hover:text-blue-600">
            Features
          </Link>
          <Link href="#" className="hover:text-blue-600">
            Documentation
          </Link>
          <Link href="#" className="hover:text-blue-600">
            Pricing
          </Link>
        </nav>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm">
            Log in
          </Button>
          <Link href="/dashboard/canvas">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            v2.0 is now live
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            Build IoT Dashboards <br />
            <span className="text-blue-600">in Minutes, Not Days</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Drag, drop, and connect real-time sensors, controls, and widgets.
            The most advanced static IoT visualization builder for developers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/dashboard/canvas">
              <Button size="lg" className="h-12 px-8 text-base">
                Launch Canvas <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              View Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl w-full px-6">
          {[
            {
              icon: LayoutDashboard,
              title: "Visual Builder",
              desc: "Intuitive drag-and-drop interface with grid snapping and alignment tools.",
            },
            {
              icon: Cpu,
              title: "Smart Widgets",
              desc: "Pre-built components for temperature, gauges, charts, and controls.",
            },
            {
              icon: ShieldCheck,
              title: "Enterprise Ready",
              desc: "Export to JSON, production-optimized code, and local storage autosave.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                <feature.icon size={20} />
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-6 border-t text-center text-sm text-gray-500 bg-gray-50">
        © 2024 IoT Portal Inc. All rights reserved.
      </footer>
    </div>
  );
}
