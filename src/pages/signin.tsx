import Image from "next/image";
import { supabaseClient } from "@/lib/supabaseClient";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { MyInputField, MyPasswordField } from "../components/MyInputField";

export default function Home() {
  const router = useRouter();

  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [signinFailed, setSigninFailed] = useState<boolean>(false);
  
  useEffect(() => {
    supabaseClient.refreshSession().then(({ data, error }) => {
      if (data.user) {
        console.log("refreshSession", error);
        router.push("/article");
      }
    });
  }, []);

  async function onClickSignIn() {
    const result = await supabaseClient.signIn(email, password);

    if (result.data.user) setUser(result.data.user);
    if (result.error) {
      setSigninFailed(true)
      setError(result.error.message);
    }
    console.log(result);
    console.log(error);
  }

  if (user) {
    router.push("/welcome");
  }

  return (
    <div className="flex items-center justify-center  h-screen">
      <div className="flex flex-col">
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

        <div className="flex justify-center mt-3 mx-9">

          <button
            onClick={()=>router.push('/signup')}
            className="inline-flex items-center m-3 px-4 py-2 border border-transparent text-sm font-medium text-indigo-800  rounded-md shadow-sm  bg-white ring-1 hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>

          <button
            onClick={onClickSignIn}
            className="inline-flex items-center m-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
