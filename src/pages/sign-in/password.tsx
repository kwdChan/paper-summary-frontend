import Image from "next/image";
import { supabaseClient } from "@/lib/supabaseClient";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { MyInputField, MyPasswordField } from "../../components/authMatters/MyInputField";
import Link from "next/link";
import { SigninWithGoogleButton } from "@/components/authMatters/SigninWithGoogle";
import { Divider } from "@/components/authMatters/Divider";

export default function Home() {
  const router = useRouter();

  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [signinFailed, setSigninFailed] = useState<boolean>(false);

  const { extensionSignin } = router.query;


  useEffect(() => {
    if (extensionSignin==='true'){
      supabaseClient.signout()
    }

    // refresh session to validate the access token and refresh token
    supabaseClient.refreshSession().then(({ data, error }) => {
      if (data.user && !extensionSignin) {
        console.log("refreshSession", error);
        router.push("/article");
      }
    });
  }, [extensionSignin]);

  async function onClickSignIn() {
    const result = await supabaseClient.signIn(email.trim(), password);

    if (result.data.user) setUser(result.data.user);
    if (result.error) {
      setSigninFailed(true)
      setError(result.error.message);
    }
    console.log(result);
    console.log(error);
  }

  
  // TODO: can use useEffect but i don't want risk it for now
  if (user) {
    router.push("welcome");
  }

  return (
    <div className="flex flex-col items-center justify-center  h-screen ">
      <div className="flex flex-col ">
      <MyInputField
          id="username"
          label="Email"
          placeholder="example@example.com"
          errored={signinFailed}
          onChange={(e) => setEmail(e.target.value)}
        />
        <MyPasswordField
          id="password"
          label="Password"
          placeholder="password"
          errored={signinFailed}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className={"mt-2 mx-auto"+" "+(error?"text-red-500":"text-white")}>{error}</div>

        <div className="flex justify-center mt-3 mx-9 ">

          <button
            onClick={()=>router.push('/getting-started')}
            className="inline-flex items-center m-3 px-4 py-2 border border-transparent text-sm font-medium text-indigo-800  rounded-md shadow-sm  bg-white ring-1 hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign up
          </button>

          <button
            onClick={onClickSignIn}
            className="inline-flex items-center m-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </div>

          <Divider/>

          <div className="flex flex-col items-center self-center">
        <button
            onClick={()=>router.push('/sign-in/passwordless')}
            className="m-3 px-4 py-2 border border-transparent text-sm font-bold text-neutral-700  rounded-sm shadow-sm  bg-white ring-1 hover:bg-neutral-700 ring-neutral-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
          >
            Passwordless sign-in
          </button>
          <SigninWithGoogleButton />
        </div>

      </div>
      <div className="bottom-7 absolute text-sm text-blue-700 underline"> <Link href='./privacy'>Privacy Policy</Link></div>
    </div>
  );
}
