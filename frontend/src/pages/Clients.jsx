import { useEffect, useState } from 'react'
import api from '../api/axios'

const empty = { name: '', afm: '', address: '', city: '', country: 'GR' }

const inputCls = "w-full h-9 border border-zinc-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

export default function Clients() {
  const [clients, setClients] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

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
      setError('Failed to save client')
    }
  }

  const edit = (c) => {
    setForm({ name: c.name, afm: c.afm, address: c.address || '', city: c.city || '', country: c.country || 'GR' })
    setEditing(c.id)
    setShowForm(true)
  }

  const remove = async (id) => {
    if (!confirm('Delete this client?')) return
    await api.delete(`/clients/${id}`)
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-zinc-900">Clients</h1>
        <button
          onClick={() => { setForm(empty); setEditing(null); setShowForm(true) }}
          className="h-8 px-4 bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Add Client
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 mb-5">
          <h3 className="text-sm font-semibold text-zinc-800 mb-4">
            {editing ? 'Edit Client' : 'New Client'}
          </h3>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</p>
          )}
          <form onSubmit={submit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Name</label>
              <input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">AFM</label>
              <input className={inputCls} value={form.afm} onChange={e => setForm({ ...form, afm: e.target.value.replace(/\D/g, '').slice(0, 9) })} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Address</label>
              <input className={inputCls} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">City</label>
              <input className={inputCls} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Country</label>
              <input className={inputCls} value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
            </div>
            <div className="col-span-2 flex gap-2 justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="h-8 px-4 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-8 px-4 text-sm font-medium bg-zinc-900 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        {clients.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-sm text-zinc-400">
            No clients yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">AFM</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">City</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Country</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {clients.map(c => (
                <tr key={c.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-5 py-3.5 font-medium text-zinc-800">{c.name}</td>
                  <td className="px-5 py-3.5 font-mono text-zinc-500">{c.afm}</td>
                  <td className="px-5 py-3.5 text-zinc-500">{c.city}</td>
                  <td className="px-5 py-3.5 text-zinc-500">{c.country}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-3 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => edit(c)} className="text-xs font-medium text-zinc-500 hover:text-blue-600 transition-colors">
                        Edit
                      </button>
                      <button onClick={() => remove(c.id)} className="text-xs font-medium text-zinc-400 hover:text-red-500 transition-colors">
                        Delete
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
