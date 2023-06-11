import Image from "next/image";
import { supabaseClient } from "@/lib/supabaseClient";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { MyInputField, MyPasswordField } from "../../components/authMatters/MyInputField";
import Link from "next/link";
import { Divider } from "@/components/authMatters/Divider";
import { SigninWithGoogleButton } from "@/components/authMatters/SigninWithGoogle";


















export default function Home() {
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [signupFailed, setSignupFailed] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    setSignupFailed(false)
    if (passwordConfirm === "") return setPasswordError(false);
    if (password === passwordConfirm) {
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }

  }, [password, passwordConfirm, email])

  async function onClickSignup() {
    if (passwordError) {
      setError('Passwords do not match')
      return
    }
    
    const { data, error } = await supabaseClient.signUp(email, password)

    if (error) {
      setSignupFailed(true)
      setError(error.message)
    }

    if (data.session) {
      router.push("/welcome");
    }

  }

  return (
    <div className="flex items-center justify-center  h-screen">
      <div className="flex flex-col">
        <MyInputField
          id="username"
          label="Email"
          placeholder="example@example.com"
          errored={signupFailed}
          onChange={(e) => setEmail(e.target.value)}
        />
        <MyPasswordField
          id="password"
          label="Password"
          placeholder="password"
          errored={passwordError||signupFailed}
          onChange={(e) => setPassword(e.target.value)}
        />

        <MyPasswordField
          id="confirm-password"
          label="Confirm password"
          placeholder="password"
          errored={passwordError||signupFailed}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />

        <div className={"mt-2 mx-auto"+" "+(error?"text-red-500":"text-white")}>{error}</div>


        <div className="flex justify-center mx-9">
          <button
            onClick={()=>router.push('/signin')}
            className="inline-flex items-center m-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to sign in
          </button>
          <button
            onClick={onClickSignup}
            className="inline-flex items-center m-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
          
          
        </div>
        <Divider/>
        <div className="flex justify-center">
          
          <SigninWithGoogleButton/>

        </div>
        
      </div>
      <div className="bottom-7 w-full text-center absolute text-sm text-blue-700 underline"> <Link href='./privacy'>Privacy Policy</Link></div>
    </div>
  );
}
