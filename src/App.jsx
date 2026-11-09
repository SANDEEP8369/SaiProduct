import { useCallback, useEffect, useState } from 'react'
import Home from './pages/Home.jsx'
import Admin from './pages/Admin.jsx'
import { clearLocal, loadData, withDefaults, writeLocal } from './store.js'

function useHash() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

export default function App() {
  const hash = useHash()
  const [state, setState] = useState({ loading: true, data: null, fromLocal: false, error: '' })

  useEffect(() => {
    loadData()
      .then((r) => setState({ loading: false, data: r.data, fromLocal: r.fromLocal, error: '' }))
      .catch(() =>
        setState({
          loading: false,
          data: withDefaults({}),
          fromLocal: false,
          error: 'Could not load equipment.json. Check that the file is next to index.html.',
        })
      )
  }, [])

  const save = useCallback((data) => {
    const ok = writeLocal(data)
    if (ok) setState((s) => ({ ...s, data, fromLocal: true }))
    return ok
  }, [])

  const discard = useCallback(async () => {
    clearLocal()
    try {
      const r = await loadData()
      setState({ loading: false, data: r.data, fromLocal: false, error: '' })
    } catch {
      setState({ loading: false, data: withDefaults({}), fromLocal: false, error: 'Could not reload equipment.json.' })
    }
  }, [])

  const isAdmin = hash.startsWith('#/admin')

  useEffect(() => {
    if (!state.data) return
    const name = state.data.settings.businessName
    document.title = isAdmin ? `Admin · ${name}` : `${name} · Construction equipment`
  }, [state.data, isAdmin])

  useEffect(() => {
    if (isAdmin) window.scrollTo(0, 0)
  }, [isAdmin])

  if (state.loading) {
    return (
      <div className="boot" role="status">
        Loading equipment…
      </div>
    )
  }

  return isAdmin ? (
    <Admin data={state.data} fromLocal={state.fromLocal} onSave={save} onDiscard={discard} />
  ) : (
    <Home data={state.data} error={state.error} />
  )
}
