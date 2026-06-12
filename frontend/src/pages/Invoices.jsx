import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const statusBadge = {
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-zinc-100 text-zinc-500',
  PENDING: 'bg-yellow-100 text-yellow-700',
}

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const navigate = useNavigate()

  const load = () => api.get('/invoices').then(res => setInvoices(res.data))
  useEffect(() => { load() }, [])

  const cancel = async (id) => {
    if (!confirm('Cancel this invoice?')) return
    await api.post(`/invoices/${id}/cancel`)
    load()
  }

  const resubmit = async (id) => {
    await api.post(`/invoices/${id}/resubmit`)
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-zinc-900">Invoices</h1>
        <button
          onClick={() => navigate('/invoices/new')}
          className="h-8 px-4 bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + New Invoice
        </button>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        {invoices.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-sm text-zinc-400">
            No invoices yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Number</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Client</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-5 py-3.5 text-zinc-500">{inv.issueDate}</td>
                  <td className="px-5 py-3.5 font-mono text-zinc-800">{inv.series}-{inv.aa}</td>
                  <td className="px-5 py-3.5 text-zinc-800">{inv.client?.name}</td>
                  <td className="px-5 py-3.5 text-zinc-800">€{inv.totalGrossValue?.toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusBadge[inv.mydataStatus] || statusBadge.PENDING}`}>
                      {inv.mydataStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-3 justify-end">
                      {inv.mydataStatus === 'ACCEPTED' && (
                        <button onClick={() => cancel(inv.id)} className="text-xs font-medium text-zinc-400 hover:text-red-500 transition-colors">
                          Cancel
                        </button>
                      )}
                      {inv.mydataStatus === 'REJECTED' && (
                        <button onClick={() => resubmit(inv.id)} className="text-xs font-medium text-zinc-400 hover:text-blue-600 transition-colors">
                          Resubmit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
