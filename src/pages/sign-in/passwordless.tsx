import Image from "next/image";
import { supabaseClient } from "@/lib/supabaseClient";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { MyInputField, MyPasswordField } from "../../components/authMatters/MyInputField";
import Link from "next/link";
import { SigninWithGoogleButton } from "@/components/authMatters/SigninWithGoogle";
import { Divider } from "@/components/authMatters/Divider";
import { OneLineInputField } from "@/components/authMatters/OneLineEmailRegister";

const H1 = ({...props }) => (
  <h1 className="text-lg font-bold mt-9 mb-3 mx-5 text-center " {...props} />
);

const P = ({...props }) => (
  <p className="text-gray-500 text-xs" {...props} />
);


function PasswordSigninButton({onClick}:{onClick:React.MouseEventHandler<HTMLButtonElement>}) {
  return (


    <button
    onClick={onClick}
    className="inline-flex items-center m-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  >
    Sign in
  </button>
  )

}



export default function Home() {
  const router = useRouter();

  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [signinFailed, setSigninFailed] = useState<boolean>(false);

  const [usePassword, setUsePassword] = useState<boolean>(false);

  const { extensionSignin } = router.query;

  // redirect the user if the extension or the web not signed in
  // also refresh the session
  useEffect(() => {
    if (extensionSignin==='true'){
      supabaseClient.signout()
    }

    supabaseClient.refreshSession().then(({ data, error }) => {
      if (data.user && !extensionSignin) {
        console.log("refreshSession", error);
        router.push("/article");
      }
    });
  }, [extensionSignin]);


  // redirect the user for password signin
  useEffect(() => {
    user && router.push("welcome");

  })

  // password signin handler
  async function passwordSigninHandler() {
    const result = await supabaseClient.signIn(email, password);

    if (result.data.user) setUser(result.data.user);
    if (result.error) {
      setSigninFailed(true)
      setError(result.error.message);
    }
    console.log(result);
    console.log(error);
  }

  // password signin handler
  async function magicLinkSigninHandler() {

  }

  return (
    <div className="flex flex-col items-center justify-center  h-screen ">

      <div className="flex flex-col ">
      <div className="max-w-xs my-5 self-center">
        <H1> Passwordless sign-in </H1>
        <P> Submit your email address and then we will send you a one-time login link. </P>

      </div>     
      <OneLineInputField placeholder="Email address"/> 
    
        {usePassword? <MyPasswordField
          id="password"
          label="Password"
          placeholder="password"
          errored={signinFailed}
          onChange={(e) => setPassword(e.target.value)}
        />: null}
        <div className={"mt-2 mx-auto"+" "+(error?"text-red-500":"text-white")}>{error}</div>

        <div className="flex justify-center mt-3 mx-9 ">

 

          
        </div>
          <Divider/>

        <div className="flex flex-col items-center self-center">
        <button
            onClick={()=>router.push('/sign-in/password')}
            className="m-3 px-4 py-2 border border-transparent text-sm font-bold text-neutral-700  rounded-sm shadow-sm  bg-white ring-1 hover:bg-neutral-700 ring-neutral-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
          >
            Sign in using password
          </button>

        <SigninWithGoogleButton />
        </div>

      </div>
      <div className="bottom-7 absolute text-sm text-blue-700 underline"> <Link href='./privacy'>Privacy Policy</Link></div>
    </div>
  );
}
