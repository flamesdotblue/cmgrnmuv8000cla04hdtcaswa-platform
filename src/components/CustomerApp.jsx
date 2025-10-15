import React from 'react'
import { useBackend } from './SharedBackendProvider'

function ProductCard({ product, onOrder }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="aspect-video bg-slate-100">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-slate-700 font-medium">${product.price.toFixed(2)}</span>
          <button
            onClick={() => onOrder(product)}
            className="inline-flex items-center rounded-md bg-slate-900 text-white text-sm px-3 py-1.5 hover:bg-slate-800"
          >
            Order
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CustomerApp() {
  const { products, placeOrder, orders } = useBackend()
  const approvedProducts = products.filter((p) => p.approved)
  const [customerName, setCustomerName] = React.useState('Guest')
  const [message, setMessage] = React.useState('')

  function handleOrder(product) {
    const o = placeOrder({ productId: product.id, customerName })
    if (o) setMessage(`Order placed for ${product.name}`)
    setTimeout(() => setMessage(''), 1800)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <section className="lg:col-span-8">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Browse Products</h2>
            <p className="text-sm text-slate-600">Only approved items are visible to customers</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Name</label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Your name"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
        </div>
        {message && (
          <div className="mb-3 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-2 text-sm">{message}</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {approvedProducts.map((p) => (
            <ProductCard key={p.id} product={p} onOrder={handleOrder} />
          ))}
          {approvedProducts.length === 0 && (
            <div className="text-slate-600">No products available yet.</div>
          )}
        </div>
      </section>

      <aside className="lg:col-span-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold mb-2">Your Recent Orders</h3>
          <div className="space-y-3 max-h-[420px] overflow-auto pr-2">
            {orders
              .filter((o) => o.customerName.toLowerCase() === (customerName || 'Guest').toLowerCase())
              .map((o) => (
                <div key={o.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{o.id}</span>
                    <span className={[
                      'text-xs px-2 py-0.5 rounded-full',
                      o.status === 'pending' && 'bg-amber-100 text-amber-900',
                      o.status === 'accepted' && 'bg-emerald-100 text-emerald-900',
                      o.status === 'shipped' && 'bg-sky-100 text-sky-900',
                      o.status === 'rejected' && 'bg-rose-100 text-rose-900',
                    ].filter(Boolean).join(' ')}>{o.status}</span>
                  </div>
                  <OrderProductDetails productId={o.productId} />
                </div>
              ))}
            {orders.filter((o) => o.customerName.toLowerCase() === (customerName || 'Guest').toLowerCase()).length === 0 && (
              <p className="text-sm text-slate-600">No orders yet.</p>
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}

function OrderProductDetails({ productId }) {
  const { products } = useBackend()
  const product = products.find((p) => p.id === productId)
  if (!product) return null
  return (
    <div className="mt-2 text-sm text-slate-700">
      <div className="flex items-center justify-between">
        <span>{product.name}</span>
        <span className="font-medium">${product.price.toFixed(2)}</span>
      </div>
    </div>
  )
}
