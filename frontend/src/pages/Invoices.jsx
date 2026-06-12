import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../api/axios'

const statusBadge = {
  ACCEPTED: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  CANCELLED: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400',
  PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
}

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const navigate = useNavigate()
  const { t } = useTranslation()

  const load = () => api.get('/invoices').then(res => setInvoices(res.data))
  useEffect(() => { load() }, [])

  const cancel = async (id) => {
    if (!confirm(t('invoices.cancelConfirm'))) return
    await api.post(`/invoices/${id}/cancel`)
    load()
  }

  const resubmit = async (id) => {
    if (!confirm(t('invoices.resubmitConfirm'))) return
    await api.post(`/invoices/${id}/resubmit`)
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{t('invoices.title')}</h1>
        <button
          onClick={() => navigate('/invoices/new')}
          className="h-8 px-4 bg-zinc-900 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + {t('invoices.newInvoice')}
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden">
        {invoices.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-sm text-zinc-400">
            {t('invoices.empty')}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t('invoices.date')}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t('invoices.number')}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t('invoices.client')}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t('invoices.gross')}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t('invoices.status')}</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  <td className="px-5 py-3.5 text-zinc-500 dark:text-zinc-400">{inv.issueDate}</td>
                  <td className="px-5 py-3.5 font-mono text-zinc-800 dark:text-zinc-200">{inv.series}-{inv.aa}</td>
                  <td className="px-5 py-3.5 text-zinc-800 dark:text-zinc-200">{inv.client?.name}</td>
                  <td className="px-5 py-3.5 text-zinc-800 dark:text-zinc-200">€{inv.totalGrossValue?.toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusBadge[inv.mydataStatus] || statusBadge.PENDING}`}>
                      {t(`status.${inv.mydataStatus}`, inv.mydataStatus)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-3 justify-end">
                      {inv.mydataStatus === 'ACCEPTED' && (
                        <button onClick={() => cancel(inv.id)} className="text-xs font-medium text-zinc-400 hover:text-red-500 transition-colors">
                          {t('invoices.cancel')}
                        </button>
                      )}
                      {inv.mydataStatus === 'REJECTED' && (
                        <button onClick={() => resubmit(inv.id)} className="text-xs font-medium text-zinc-400 hover:text-blue-600 transition-colors">
                          {t('invoices.resubmit')}
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
