import React from 'react'
import { useBackend } from './SharedBackendProvider'

export default function AdminPortal() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <section className="lg:col-span-5">
        <ProductApprovals />
      </section>
      <section className="lg:col-span-7">
        <OrdersOverview />
      </section>
    </div>
  )
}

function ProductApprovals() {
  const { products, approveProduct } = useBackend()
  const pending = products.filter((p) => !p.approved)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="font-semibold mb-2">Product Approvals</h3>
      <div className="space-y-3 max-h-[480px] overflow-auto pr-2">
        {pending.map((p) => (
          <div key={p.id} className="rounded-lg border border-slate-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-slate-600">${p.price.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => approveProduct(p.id, true)}
                  className="rounded-md bg-emerald-600 text-white text-xs px-3 py-1.5 hover:bg-emerald-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => approveProduct(p.id, false)}
                  className="rounded-md border border-slate-300 text-slate-700 text-xs px-3 py-1.5 hover:bg-slate-50"
                >
                  Keep Pending
                </button>
              </div>
            </div>
          </div>
        ))}
        {pending.length === 0 && <p className="text-sm text-slate-600">No pending items. Great job!</p>}
      </div>
    </div>
  )
}

function OrdersOverview() {
  const { orders, products, updateOrderStatus } = useBackend()

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="font-semibold mb-2">Orders Overview</h3>
      <div className="space-y-3 max-h-[480px] overflow-auto pr-2">
        {orders.map((o) => {
          const product = products.find((p) => p.id === o.productId)
          return (
            <div key={o.id} className="rounded-lg border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{product?.name || 'Product'} • ${product ? product.price.toFixed(2) : '—'}</div>
                  <div className="text-xs text-slate-600">Order: {o.id} • Customer: {o.customerName}</div>
                </div>
                <span className={[
                  'text-xs px-2 py-0.5 rounded-full',
                  o.status === 'pending' && 'bg-amber-100 text-amber-900',
                  o.status === 'accepted' && 'bg-emerald-100 text-emerald-900',
                  o.status === 'shipped' && 'bg-sky-100 text-sky-900',
                  o.status === 'rejected' && 'bg-rose-100 text-rose-900',
                ].filter(Boolean).join(' ')}>
                  {o.status}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => updateOrderStatus(o.id, 'pending')}
                  className="rounded-md border border-slate-300 text-slate-700 text-xs px-3 py-1.5 hover:bg-slate-50"
                >
                  Set Pending
                </button>
                <button
                  onClick={() => updateOrderStatus(o.id, 'accepted')}
                  className="rounded-md bg-emerald-600 text-white text-xs px-3 py-1.5 hover:bg-emerald-700"
                >
                  Mark Accepted
                </button>
                <button
                  onClick={() => updateOrderStatus(o.id, 'shipped')}
                  className="rounded-md bg-sky-600 text-white text-xs px-3 py-1.5 hover:bg-sky-700"
                >
                  Mark Shipped
                </button>
                <button
                  onClick={() => updateOrderStatus(o.id, 'rejected')}
                  className="rounded-md bg-rose-600 text-white text-xs px-3 py-1.5 hover:bg-rose-700"
                >
                  Reject
                </button>
              </div>
            </div>
          )
        })}
        {orders.length === 0 && <p className="text-sm text-slate-600">No orders yet.</p>}
      </div>
    </div>
  )
}
