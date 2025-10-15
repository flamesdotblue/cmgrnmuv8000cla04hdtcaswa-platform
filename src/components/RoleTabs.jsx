import React from 'react'

const tabs = [
  { key: 'customer', label: 'Customer App' },
  { key: 'vendor', label: 'Vendor App' },
  { key: 'admin', label: 'Admin Portal' },
]

export default function RoleTabs({ active, onChange }) {
  return (
    <div className="w-full">
      <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={[
              'px-4 py-2 text-sm rounded-md transition',
              active === t.key
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-700 hover:bg-slate-50',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
