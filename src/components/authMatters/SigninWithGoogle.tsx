import React, { useEffect, useRef, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

import Image from 'next/image'
import Head from "next/head";

export function SigninWithGoogleButton() {
  let originName = useRef('')
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const button = useRef<HTMLDivElement>(null);
  useEffect(() => {
    originName.current = window.location.origin;

    function handleCredentialResponse(response) {
      console.log("Encoded JWT ID token: " + response.credential);
    }
    google.accounts.id.initialize({
      client_id: "848494833065-40fbkfmuljlovlivsm4rqc65hls2agso.apps.googleusercontent.com",
      login_uri: "https://mbjyxjgolhbfbkcnocdu.supabase.co/auth/v1/callback",
      ux_mode: "popup",
      callback: handleCredentialResponse
    })

    google.accounts.id.renderButton(
      button.current,
      { theme: "outline", size: "large" }  // customization attributes
    );
    //google.accounts.id.prompt();

    console.log(google);


    }, []);



  return (
    <div className="relative w-52 h-12">
            

      <div 
        ref={button}
        className="g_id_signin"
         data-type="standard"
         data-size="large"
         data-theme="outline"
         data-text="sign_in_with"
         data-shape="rectangular"
         data-logo_alignment="left">
      </div>

        
  </div>
           
  );
}
