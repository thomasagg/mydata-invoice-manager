import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Dashboard() {
  const [invoices, setInvoices] = useState([])

  useEffect(() => {
    api.get('/invoices').then(res => setInvoices(res.data))
  }, [])

  const total = invoices.length
  const accepted = invoices.filter(i => i.mydataStatus === 'ACCEPTED').length
  const rejected = invoices.filter(i => i.mydataStatus === 'REJECTED').length
  const cancelled = invoices.filter(i => i.mydataStatus === 'CANCELLED').length

  const stats = [
    { label: 'Total Invoices', value: total },
    { label: 'Accepted', value: accepted },
    { label: 'Rejected', value: rejected },
    { label: 'Cancelled', value: cancelled },
  ]

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold text-zinc-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-zinc-900">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
