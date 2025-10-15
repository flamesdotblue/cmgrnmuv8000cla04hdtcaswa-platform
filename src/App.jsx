import React from 'react'
import Header from './components/Header'
import RoleTabs from './components/RoleTabs'
import CustomerApp from './components/CustomerApp'
import VendorApp from './components/VendorApp'
import AdminPortal from './components/AdminPortal'
import { SharedBackendProvider } from './components/SharedBackendProvider'

export default function App() {
  const [activeRole, setActiveRole] = React.useState('customer')

  return (
    <SharedBackendProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
        <Header />
        <main className="max-w-6xl mx-auto px-4 pb-16">
          <RoleTabs active={activeRole} onChange={setActiveRole} />
          <div className="mt-6">
            {activeRole === 'customer' && <CustomerApp />}
            {activeRole === 'vendor' && <VendorApp />}
            {activeRole === 'admin' && <AdminPortal />}
          </div>
        </main>
      </div>
    </SharedBackendProvider>
  )
}
