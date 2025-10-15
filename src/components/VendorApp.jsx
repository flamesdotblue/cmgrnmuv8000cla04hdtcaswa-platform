import React from 'react'
import { useBackend } from './SharedBackendProvider'

export default function VendorApp() {
  const { vendors, products, orders, addProduct, updateOrderStatus } = useBackend()
  const [activeVendorId, setActiveVendorId] = React.useState(vendors[0]?.id || '')
  const vendorProducts = products.filter((p) => p.vendorId === activeVendorId)
  const vendorOrders = orders.filter((o) => o.vendorId === activeVendorId)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <section className="lg:col-span-4 space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold mb-2">Vendor Identity</h3>
          <select
            value={activeVendorId}
            onChange={(e) => setActiveVendorId(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
          <p className="text-sm text-slate-600 mt-2">Switch vendors to see isolated data and actions.</p>
        </div>
        <AddProductForm vendorId={activeVendorId} onAdd={addProduct} />
      </section>

      <section className="lg:col-span-4 space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold mb-2">My Products</h3>
          <div className="space-y-3 max-h-[420px] overflow-auto pr-2">
            {vendorProducts.map((p) => (
              <div key={p.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-slate-600">${p.price.toFixed(2)}</div>
                  </div>
                  <span className={[
                    'text-xs px-2 py-0.5 rounded-full',
                    p.approved ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900',
                  ].join(' ')}>
                    {p.approved ? 'Approved' : 'Pending Approval'}
                  </span>
                </div>
              </div>
            ))}
            {vendorProducts.length === 0 && <p className="text-sm text-slate-600">No products yet.</p>}
          </div>
        </div>
      </section>

      <section className="lg:col-span-4 space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold mb-2">Incoming Orders</h3>
          <div className="space-y-3 max-h-[420px] overflow-auto pr-2">
            {vendorOrders.map((o) => (
              <VendorOrderItem key={o.id} order={o} onUpdate={updateOrderStatus} />
            ))}
            {vendorOrders.length === 0 && <p className="text-sm text-slate-600">No orders yet.</p>}
          </div>
        </div>
      </section>
    </div>
  )
}

function AddProductForm({ vendorId, onAdd }) {
  const [name, setName] = React.useState('')
  const [price, setPrice] = React.useState('')
  const [image, setImage] = React.useState('')
  const [msg, setMsg] = React.useState('')

  function submit(e) {
    e.preventDefault()
    if (!vendorId || !name || !price) return
    const p = onAdd({ name, price, vendorId, image })
    if (p) {
      setMsg('Product submitted for approval')
      setName('')
      setPrice('')
      setImage('')
      setTimeout(() => setMsg(''), 2000)
    }
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="font-semibold mb-2">Add Product</h3>
      {msg && <div className="mb-2 text-sm rounded-md bg-sky-50 border border-sky-200 text-sky-900 px-3 py-2">{msg}</div>}
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1 text-slate-700">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="e.g., Steel Ladder"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-slate-700">Price</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            step="0.01"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="e.g., 49.99"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-slate-700">Image URL (optional)</label>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="https://..."
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-slate-900 text-white text-sm px-3 py-2 hover:bg-slate-800"
        >
          Submit for Approval
        </button>
      </div>
    </form>
  )
}

function VendorOrderItem({ order, onUpdate }) {
  const { products } = useBackend()
  const product = products.find((p) => p.id === order.productId)

  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium text-sm">{product?.name || 'Product'}</div>
          <div className="text-xs text-slate-600">Order: {order.id} • Customer: {order.customerName}</div>
        </div>
        <span className={[
          'text-xs px-2 py-0.5 rounded-full',
          order.status === 'pending' && 'bg-amber-100 text-amber-900',
          order.status === 'accepted' && 'bg-emerald-100 text-emerald-900',
          order.status === 'shipped' && 'bg-sky-100 text-sky-900',
          order.status === 'rejected' && 'bg-rose-100 text-rose-900',
        ].filter(Boolean).join(' ')}>
          {order.status}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        {order.status === 'pending' && (
          <>
            <button
              onClick={() => onUpdate(order.id, 'accepted')}
              className="rounded-md bg-emerald-600 text-white text-xs px-3 py-1.5 hover:bg-emerald-700"
            >
              Accept
            </button>
            <button
              onClick={() => onUpdate(order.id, 'rejected')}
              className="rounded-md bg-rose-600 text-white text-xs px-3 py-1.5 hover:bg-rose-700"
            >
              Reject
            </button>
          </>
        )}
        {order.status === 'accepted' && (
          <button
            onClick={() => onUpdate(order.id, 'shipped')}
            className="rounded-md bg-sky-600 text-white text-xs px-3 py-1.5 hover:bg-sky-700"
          >
            Mark Shipped
          </button>
        )}
      </div>
    </div>
  )
}
