import { supabaseClient } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {ConfirmInChrome} from "@/components/authMatters/ConfirmInChrome";

import { useState } from 'react'
import { Dialog } from '@headlessui/react'


export default function Page() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false)


  useEffect(() => {
    if (window.parent!=window) {
      setIsOpen(true)
    } else{
      router.push("/article")
    }

  }, [])

  const submitCredentials = () => {
    supabaseClient.client.auth.getSession().then(({ data, error }) => {
      window.parent.postMessage(
        { message: 'signin', payload: { data, error }  }, 
        '*'
      );
    })

  }

  return (
    <div>
      
      <div className="absolute top-1/2">
        Welcome! If you are from the web:{" "}
        <Link href="/article" ><span className="text-blue-700 underline hover:cursor-pointer">click here</span></Link>
        <br /><br />
        If you are from the extension, close the pop up and open it again.
      </div>
      <ConfirmInChrome isOpen={isOpen} onAccept={submitCredentials} onCancel={()=>{supabaseClient.signout()}}/>
    </div>
  );
}
