import { useEffect, useState } from 'react'
import './App.css'
import Auth from './components/Auth'
import { supabase } from './lib/supabaseClient'
import { Session } from '@supabase/supabase-js'
import Main from './components/Main'
function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    
    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (
      <>
        <Auth />
      </>
    )
  }

  return (
    <>
      <Main />
    </>
  )
}

export default App;