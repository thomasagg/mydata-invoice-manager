import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../api/axios'

const empty = { name: '', afm: '', address: '', city: '', country: 'GR' }

export default function Clients() {
  const [clients, setClients] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const { t } = useTranslation()

  const inputCls = "w-full h-9 border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"

  const load = () => api.get('/clients').then(res => setClients(res.data))
  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      editing
        ? await api.put(`/clients/${editing}`, form)
        : await api.post('/clients', form)
      setForm(empty)
      setEditing(null)
      setShowForm(false)
      load()
    } catch {
      setError(t('clients.error'))
    }
  }

  const edit = (c) => {
    setForm({ name: c.name, afm: c.afm, address: c.address || '', city: c.city || '', country: c.country || 'GR' })
    setEditing(c.id)
    setShowForm(true)
  }

  const remove = async (id) => {
    if (!confirm(t('clients.deleteConfirm'))) return
    await api.delete(`/clients/${id}`)
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{t('clients.title')}</h1>
        <button
          onClick={() => { setForm(empty); setEditing(null); setShowForm(true) }}
          className="h-8 px-4 bg-zinc-900 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + {t('clients.add')}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm p-6 mb-5">
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
            {editing ? t('clients.edit') : t('clients.new')}
          </h3>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 mb-4">{error}</p>
          )}
          <form onSubmit={submit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">{t('clients.name')}</label>
              <input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">{t('clients.afm')}</label>
              <input className={inputCls} value={form.afm} onChange={e => setForm({ ...form, afm: e.target.value.replace(/\D/g, '').slice(0, 9) })} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">{t('clients.address')}</label>
              <input className={inputCls} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">{t('clients.city')}</label>
              <input className={inputCls} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">{t('clients.country')}</label>
              <input className={inputCls} value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
            </div>
            <div className="col-span-2 flex gap-2 justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="h-8 px-4 text-sm font-medium text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-500 transition-colors"
              >
                {t('clients.cancel')}
              </button>
              <button
                type="submit"
                className="h-8 px-4 text-sm font-medium bg-zinc-900 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 text-white rounded-lg transition-colors"
              >
                {t('clients.save')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden">
        {clients.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-sm text-zinc-400">
            {t('clients.empty')}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t('clients.name')}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t('clients.afm')}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t('clients.city')}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t('clients.country')}</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
              {clients.map(c => (
                <tr key={c.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group">
                  <td className="px-5 py-3.5 font-medium text-zinc-800 dark:text-zinc-200">{c.name}</td>
                  <td className="px-5 py-3.5 font-mono text-zinc-500 dark:text-zinc-400">{c.afm}</td>
                  <td className="px-5 py-3.5 text-zinc-500 dark:text-zinc-400">{c.city}</td>
                  <td className="px-5 py-3.5 text-zinc-500 dark:text-zinc-400">{c.country}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-3 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => edit(c)} className="text-xs font-medium text-zinc-500 hover:text-blue-600 transition-colors">
                        {t('clients.editBtn')}
                      </button>
                      <button onClick={() => remove(c.id)} className="text-xs font-medium text-zinc-400 hover:text-red-500 transition-colors">
                        {t('clients.deleteBtn')}
                      </button>
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
