import React, { useEffect, useRef, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

import Image from "next/image";

export function SigninWithGoogleButtonSVG() {
  const originName = useRef("");
  const [mouseDown, setMouseDown] = useState<boolean>(false);

  useEffect(() => {
    originName.current = window.location.origin;
  }, []);

  async function signInWithGoogle() {
    const { data, error } = await supabaseClient.client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: originName.current + "/sign-in/welcome",
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  }

  return (
    <div
      className="flex flex-row w-52 h-10 ring-1 ring-neutral-400 rounded-[1px] shadow-md items-center justify-between"
      role="button"
    >
      <div className=" relative w-10 h-5">
        <Image
          onClick={signInWithGoogle}
          src="/google_signin_buttons/web/vector/btn_google_light_normal_ios.svg"
          alt="google signin button"
          layout="fill"
          onMouseDown={() => setMouseDown(true)}
          onMouseUp={() => setMouseDown(false)}
        />{" "}
      </div>
      <div className="text-sm font-semibold text-neutral-500 mr-2">Sign in with Google</div>
    </div>
  );
}

export function SigninWithGoogleButton() {
  const originName = useRef("");
  const [mouseDown, setMouseDown] = useState<boolean>(false);

  useEffect(() => {
    originName.current = window.location.origin;
  }, []);

  async function signInWithGoogle() {
    const { data, error } = await supabaseClient.client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: originName.current + "/sign-in/welcome",
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  }

  return (
    <div className="relative w-52 h-12 rounded-sm" role="button">
      <Image
        onClick={signInWithGoogle}
        className="border-2 border-black hover:cursor-pointer "
        src="/google_signin_buttons/web/2x/btn_google_signin_light_normal_web@2x.png"
        alt="google signin button"
        layout="fill"
        onMouseDown={() => setMouseDown(true)}
        onMouseUp={() => setMouseDown(false)}
      />
    </div>
  );
}
