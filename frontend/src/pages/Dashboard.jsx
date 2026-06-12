import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../api/axios'

export default function Dashboard() {
  const [invoices, setInvoices] = useState([])
  const { t } = useTranslation()

  useEffect(() => {
    api.get('/invoices').then(res => setInvoices(res.data))
  }, [])

  const total = invoices.length
  const accepted = invoices.filter(i => i.mydataStatus === 'ACCEPTED').length
  const revenue = invoices
    .filter(i => i.mydataStatus === 'ACCEPTED')
    .reduce((sum, i) => sum + (i.totalGrossValue || 0), 0)
  const pending = invoices.filter(i => i.mydataStatus === 'PENDING').length

  const stats = [
    { label: t('dashboard.totalInvoices'), value: total },
    { label: t('dashboard.accepted'), value: accepted },
    { label: t('dashboard.revenue'), value: `€${revenue.toFixed(2)}` },
    { label: t('dashboard.pending'), value: pending },
  ]

  const recent = invoices.slice(0, 5)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{t('dashboard.title')}</h1>
        <Link
          to="/invoices/new"
          className="h-8 px-4 bg-zinc-900 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 text-white text-sm font-medium rounded-lg transition-colors flex items-center"
        >
          + {t('dashboard.newInvoice')}
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm p-5">
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{t('dashboard.recentInvoices')}</h2>
          <Link to="/invoices" className="text-xs font-medium text-blue-600 hover:text-blue-700">{t('dashboard.viewAll')}</Link>
        </div>
        {recent.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-sm text-zinc-400">
            {t('dashboard.empty')}{' '}
            <Link to="/invoices/new" className="ml-1 text-blue-600 hover:underline">{t('dashboard.createOne')}</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
              {recent.map(inv => (
                <tr key={inv.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  <td className="px-5 py-3 text-zinc-500 dark:text-zinc-400">{inv.issueDate}</td>
                  <td className="px-5 py-3 font-mono text-zinc-800 dark:text-zinc-200">{inv.series}-{inv.aa}</td>
                  <td className="px-5 py-3 text-zinc-700 dark:text-zinc-300">{inv.client?.name}</td>
                  <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100">€{inv.totalGrossValue?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
