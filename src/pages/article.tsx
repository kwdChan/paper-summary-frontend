import {NavIcon} from '@/components/navIcon';
import { Article } from '@/utils/types';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useRealtime } from 'react-supabase'


export default function Page() {
  const [{ data, error, fetching }, reexecute] = useRealtime<Article>('article')
  const router = useRouter()

  useEffect(() => {console.log(data)}, [data])
  

  return (
  <div>

    <header><NavIcon/></header>
    <ol>
        {
            data?.map((article) => (
            <li 
            key={article.id} 
            className='hover:bg-slate-200 hover:cursor-pointer'
            onClick={() => {router.push(`/article/${article.id}`)}}
            
            >
                {article.title}
            
            </li>
            ))
        }



    </ol>
    </div>
    
    
    )
}