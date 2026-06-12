import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../api/axios'

const VAT_CATEGORIES = [
  { value: 1, label: '24%' },
  { value: 2, label: '13%' },
  { value: 3, label: '6%' },
  { value: 7, label: '0%' },
  { value: 8, label: 'Exempt' },
]

const INVOICE_TYPES = [
  { value: '1.1', label: '1.1 - Sales Invoice' },
  { value: '2.1', label: '2.1 - Service Invoice' },
]

const emptyLine = { description: '', quantity: '1', unitPrice: '', vatCategory: 1 }

export default function NewInvoice() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [clients, setClients] = useState([])
  const [form, setForm] = useState({
    series: 'A',
    aa: '',
    issueDate: new Date().toISOString().split('T')[0],
    invoiceType: '1.1',
    clientId: '',
  })
  const [lines, setLines] = useState([{ ...emptyLine }])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/clients').then(res => {
      setClients(res.data)
      if (res.data.length > 0) setForm(f => ({ ...f, clientId: res.data[0].id }))
    })
  }, [])

  const setLine = (i, key, value) => {
    const updated = [...lines]
    updated[i] = { ...updated[i], [key]: value }
    setLines(updated)
  }

  const calcLine = (line) => {
    const net = parseFloat(line.quantity || 0) * parseFloat(line.unitPrice || 0)
    const rates = { 1: 0.24, 2: 0.13, 3: 0.06, 7: 0, 8: 0 }
    const vat = net * (rates[line.vatCategory] || 0)
    return { net: isNaN(net) ? 0 : net, vat: isNaN(vat) ? 0 : vat }
  }

  const totals = lines.reduce((acc, l) => {
    const { net, vat } = calcLine(l)
    return { net: acc.net + net, vat: acc.vat + vat }
  }, { net: 0, vat: 0 })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/invoices', {
        ...form,
        clientId: parseInt(form.clientId),
        lines: lines.map(l => ({
          description: l.description,
          quantity: parseFloat(l.quantity),
          unitPrice: parseFloat(l.unitPrice),
          vatCategory: parseInt(l.vatCategory),
        }))
      })
      navigate('/invoices')
    } catch {
      setError(t('newInvoice.error'))
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full h-9 border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{t('newInvoice.title')}</h1>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 mb-4">{error}</p>
      )}

      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-4">{t('newInvoice.details')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">{t('newInvoice.series')}</label>
              <input className={inputCls} value={form.series} onChange={e => setForm({ ...form, series: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">{t('newInvoice.number')}</label>
              <input className={inputCls} value={form.aa} onChange={e => setForm({ ...form, aa: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">{t('newInvoice.date')}</label>
              <input type="date" className={inputCls} value={form.issueDate} onChange={e => setForm({ ...form, issueDate: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">{t('newInvoice.type')}</label>
              <select className={inputCls} value={form.invoiceType} onChange={e => setForm({ ...form, invoiceType: e.target.value })}>
                {INVOICE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">{t('newInvoice.client')}</label>
              <select className={inputCls} value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })} required>
                <option value="">{t('newInvoice.selectClient')}</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.afm})</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{t('newInvoice.lines')}</h3>
            <button
              type="button"
              onClick={() => setLines([...lines, { ...emptyLine }])}
              className="h-7 px-3 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-md transition-colors"
            >
              {t('newInvoice.addLine')}
            </button>
          </div>

          <div className="grid grid-cols-12 gap-2 mb-2">
            <div className="col-span-4 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t('newInvoice.description')}</div>
            <div className="col-span-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t('newInvoice.qty')}</div>
            <div className="col-span-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t('newInvoice.unitPrice')}</div>
            <div className="col-span-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t('newInvoice.vatLabel')}</div>
            <div className="col-span-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider text-right">Net</div>
          </div>

          <div className="flex flex-col gap-2">
            {lines.map((line, i) => {
              const { net } = calcLine(line)
              return (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <input className={inputCls} value={line.description} onChange={e => setLine(i, 'description', e.target.value)} required />
                  </div>
                  <div className="col-span-2">
                    <input type="number" step="0.01" min="0" className={inputCls} value={line.quantity} onChange={e => setLine(i, 'quantity', e.target.value)} required />
                  </div>
                  <div className="col-span-2">
                    <input type="number" step="0.01" min="0" className={inputCls} value={line.unitPrice} onChange={e => setLine(i, 'unitPrice', e.target.value)} required />
                  </div>
                  <div className="col-span-2">
                    <select className={inputCls} value={line.vatCategory} onChange={e => setLine(i, 'vatCategory', parseInt(e.target.value))}>
                      {VAT_CATEGORIES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                    </select>
                  </div>
                  <div className="col-span-1 text-right font-mono text-sm font-semibold text-zinc-700 dark:text-zinc-300">€{net.toFixed(2)}</div>
                  <div className="col-span-1 flex justify-end">
                    {lines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setLines(lines.filter((_, idx) => idx !== i))}
                        className="w-6 h-6 rounded text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center text-xs transition-colors"
                      >
                        x
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex justify-between w-52 text-sm">
                <span className="text-zinc-400">{t('newInvoice.netTotal')}</span>
                <span className="font-mono font-medium text-zinc-600 dark:text-zinc-300">€{totals.net.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-52 text-sm">
                <span className="text-zinc-400">{t('newInvoice.vatTotal')}</span>
                <span className="font-mono font-medium text-zinc-600 dark:text-zinc-300">€{totals.vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-52 text-sm font-bold text-zinc-900 dark:text-zinc-100 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                <span>{t('newInvoice.grossTotal')}</span>
                <span className="font-mono">€{(totals.net + totals.vat).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => navigate('/invoices')}
            className="h-9 px-4 text-sm font-medium text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 hover:border-zinc-300 dark:hover:border-zinc-500 rounded-lg transition-colors"
          >
            {t('newInvoice.cancel')}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="h-9 px-5 bg-zinc-900 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? t('newInvoice.submitting') : t('newInvoice.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}
