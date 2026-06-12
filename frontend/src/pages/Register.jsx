import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../api/axios'

export default function Register() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [form, setForm] = useState({
    username: '', password: '', email: '', afm: '', businessName: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      localStorage.setItem('token', res.data.token)
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.message || ''
      if (msg.includes('Username')) setError(t('register.errorUsernameTaken'))
      else if (msg.includes('Email')) setError(t('register.errorEmailTaken'))
      else setError(t('register.error'))
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full h-9 border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{t('register.title')}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{t('register.subtitle')}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm p-6">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 mb-4">{error}</p>
          )}
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t('register.username')}</label>
              <input className={inputCls} value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required minLength={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t('register.password')}</label>
              <input type="password" className={inputCls} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t('register.email')}</label>
              <input type="email" className={inputCls} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t('register.afm')}</label>
              <input className={inputCls} value={form.afm} onChange={e => setForm({ ...form, afm: e.target.value.replace(/\D/g, '').slice(0, 9) })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                {t('register.businessName')} <span className="text-zinc-400 font-normal">{t('register.businessNameOptional')}</span>
              </label>
              <input className={inputCls} value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })} />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-9 bg-zinc-900 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 mt-1"
            >
              {loading ? t('register.submitting') : t('register.submit')}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-4">
          {t('register.hasAccount')}{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">{t('register.login')}</Link>
        </p>
      </div>
    </div>
  )
}
