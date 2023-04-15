import '@/styles/globals.css'
import type { AppProps } from 'next/app'


import { createClient } from '@supabase/supabase-js'
import { Provider } from 'react-supabase'


const SUPABASE_URL: string = process.env.NEXT_PUBLIC_SUPABASE_URL||'';
const SUPABASE_KEY: string = process.env.NEXT_PUBLIC_SUPABASE_KEY||'';
const client = createClient(SUPABASE_URL, SUPABASE_KEY)



export default function App({ Component, pageProps }: AppProps) {
  return <Provider value={client}><Component {...pageProps} /> </Provider>
}
