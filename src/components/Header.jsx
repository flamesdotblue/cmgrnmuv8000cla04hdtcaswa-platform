import React from 'react'

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">3</div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Multi-App Commerce System</h1>
            <p className="text-sm text-slate-600">Customer App • Vendor App • Admin Portal — all on one shared backend</p>
          </div>
        </div>
        <a
          href="#"
          className="hidden sm:inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 transition"
        >
          View Docs
        </a>
      </div>
    </header>
  )
}
