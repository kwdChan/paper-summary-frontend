import React, { useEffect, useRef, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

import Image from 'next/image'

export function SigninWithGoogleButton() {
  let originName = useRef('')
  const [mouseDown, setMouseDown] = useState<boolean>(false);

  useEffect(() => {
    originName.current = window.location.origin;
    }, []);


  async function signInWithGoogle() {

    const { data, error } = await supabaseClient.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: originName.current+'/welcome',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

  }

  return (
    <div className="relative w-52 h-12 rounded-sm" role="button">
        <Image 
        onClick={signInWithGoogle}  
        className="border-2 border-black hover:cursor-pointer "
        src="/google_signin_buttons/web/2x/btn_google_signin_light_normal_web@2x.png"
        alt='google signin button'
        layout='fill'
        onMouseDown={()=>setMouseDown(true)}
        onMouseUp={()=>setMouseDown(false)}
        />     
  </div>

  );
}