import React from 'react';
import { useRealtime } from 'react-supabase'

export default function Page() {
  const [{ data, error, fetching }, reexecute] = useRealtime('article')

  

  return (
  <div>
    <header className=' bg-black text-white'>
    <nav className='flex p-1 justify-center'>
        <div className='hover:bg-blue-50 hover:text-black  rounded-sm m-2 p-2'>
            <a href='/' className='text-sm'>Show All</a>
        </div>

        <div className='hover:bg-blue-50 hover:text-black  rounded-sm m-2 p-2'>
            <a href='/' className='text-sm'>Show All</a>
        </div>
    </nav>
    </header>
    
    

    {JSON.stringify(data)}
    {JSON.stringify(data)}
    {JSON.stringify(data)}
    {JSON.stringify(data)}
    {JSON.stringify(data)}
    {JSON.stringify(data)}
    {JSON.stringify(data)}
    </div>
    
    
    )
}