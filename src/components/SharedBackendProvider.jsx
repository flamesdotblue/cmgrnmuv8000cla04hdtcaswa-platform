import React, { createContext, useContext, useMemo, useState } from 'react'

const SharedBackendContext = createContext(null)

function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

const initialVendors = [
  { id: 'v_a', name: 'Vendor Alpha' },
  { id: 'v_b', name: 'Vendor Beta' },
]

const initialProducts = [
  { id: 'p1', name: 'Electrical Cable 10m', price: 19.99, vendorId: 'v_a', approved: true, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop' },
  { id: 'p2', name: 'Industrial Drill', price: 129.5, vendorId: 'v_b', approved: false, image: 'https://images.unsplash.com/photo-1606229365485-93a3b8d0a2a5?q=80&w=800&auto=format&fit=crop' },
  { id: 'p3', name: 'Safety Helmet', price: 24.0, vendorId: 'v_a', approved: true, image: 'https://images.unsplash.com/photo-1601655781326-c6f5b4f58c30?q=80&w=800&auto=format&fit=crop' },
]

const initialOrders = [
  { id: 'o1', productId: 'p1', customerName: 'Aisha', status: 'accepted', vendorId: 'v_a', createdAt: Date.now() - 1000 * 60 * 60 },
]

export function SharedBackendProvider({ children }) {
  const [vendors, setVendors] = useState(initialVendors)
  const [products, setProducts] = useState(initialProducts)
  const [orders, setOrders] = useState(initialOrders)

  // Customer operations
  function placeOrder({ productId, customerName }) {
    const product = products.find((p) => p.id === productId && p.approved)
    if (!product) return null
    const order = {
      id: uid('ord'),
      productId,
      customerName: customerName || 'Guest',
      status: 'pending',
      vendorId: product.vendorId,
      createdAt: Date.now(),
    }
    setOrders((prev) => [order, ...prev])
    return order
  }

  // Vendor operations
  function addProduct({ name, price, vendorId, image }) {
    const vendor = vendors.find((v) => v.id === vendorId)
    if (!vendor) return null
    const product = {
      id: uid('prod'),
      name,
      price: Number(price) || 0,
      vendorId,
      approved: false,
      image: image || 'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=800&auto=format&fit=crop',
    }
    setProducts((prev) => [product, ...prev])
    return product
  }

  function updateOrderStatus(orderId, status) {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
  }

  // Admin operations
  function approveProduct(productId, approved) {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, approved } : p)))
  }

  const value = useMemo(
    () => ({
      vendors,
      products,
      orders,
      placeOrder,
      addProduct,
      updateOrderStatus,
      approveProduct,
    }),
    [vendors, products, orders]
  )

  return (
    <SharedBackendContext.Provider value={value}>
      {children}
    </SharedBackendContext.Provider>
  )
}

export function useBackend() {
  const ctx = useContext(SharedBackendContext)
  if (!ctx) throw new Error('useBackend must be used within SharedBackendProvider')
  return ctx
}
