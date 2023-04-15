import Image from 'next/image'
import { useSignIn, useAuthStateChange, useRealtime, useFilter } from 'react-supabase'
import type { Filter } from 'react-supabase'

import { useRouter } from 'next/router'

import React from 'react';


interface Article {
    id: number,
    //created_at: string,
    user_id: string,
    source: string,
    title: string
}

interface Highlight {
    id: number,
    //created_at: string,
    article_id: number,
    title: string
}


export default function Page(){

    const router = useRouter()
    const { article_id } = router.query
    let article:Article|null = null
    let highlight:Array<Highlight> = []

    if (article_id){
        const filter = useFilter((query)=>query.eq('id', article_id), [article_id])
        const [result, reexecute] = useRealtime<Article>('article', {select:{filter:filter}})
        if (result.data && (result.data.length > 0)){
            article = result.data[0]
        }else{
            article = null
        }
    }
    if (article_id) {
        const filter = useFilter((query)=>query.eq('article_id', article_id), [article_id])
        const [result, reexecute] = useRealtime<Highlight>('highlight', {select:{filter:filter}})
        
        if (result.data && (result.data.length > 0)){
            highlight = result.data
        }

    }

    return (

        <>{(JSON.stringify(article)||'')}
       {(JSON.stringify(highlight)||'')}</>
    )

}