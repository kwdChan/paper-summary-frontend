import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { NavIcon } from "@/components/navIcon";
import { UserInfo } from "@/lib/types";
import Link from "next/link";
import PrivacyPolicyLink from "@/components/theme/PrivacyPolicyLink";
import { TopBar } from "@/components/theme/TopBar";
import { MyPasswordField } from "@/components/authMatters/MyInputField";

function PasswordReset() {
  const [visible, setVisible] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    setSuccess(false)
    if (passwordConfirm === "") return setPasswordError(false);
    if (password.trim() === passwordConfirm.trim()) {
      setPasswordError(false);
      setError('')
    } else {
      setPasswordError(true);
      setError('Passwords do not match')
    }

  }, [password, passwordConfirm])

  const onClick = async () => {
    if (passwordError) return;
    const {data, error} = await supabaseClient.updatePassword(password.trim())
    if (error) {
      setError(error.message)
    }
    else{
      setSuccess(true)
    }
  }


  return (
    <div className="flex flex-col items-center">
      <div 
      className={"text-lg font-bold mt-5 text-center hover:cursor-pointer rounded-sm py-1 px-3 hover:ring-2 hover:bg-blue-50" + " " + (!visible&&"ring-1") } 
      onClick={()=>{setVisible(!visible)}} 
      role="button" > 
      Update Password </div>

      {
        visible && (
          <><MyPasswordField
          id="new-password"
          label="New password"
          placeholder="New password"
          errored={passwordError}
          onChange={(e) => setPassword(e.target.value)}
        />
  
        <MyPasswordField
          id="confirm-password"
          label="Confirm new password"
          placeholder="New password"
          errored={passwordError}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <div className={"mx-auto"+" "+(error?"text-red-500":"text-white")}>{error}</div>
        <button 
        className="m-3 px-4 py-2 my-6 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        onClick={onClick}
        >
          {success? "Reset!":"Confirm"}
        </button></>
        )

      }
      
    </div>
  );
}

function UsageDisaply() {
  const [userInfo, setUserInfo] = React.useState<UserInfo | null>(null);

  // these should only be set by the useEffect of data
  const [usage_ofUserInfo, setUsage_ofUserInfo] = React.useState<number>(0);
  const [limit_ofUserInfo, setLimit_ofUserInfo] = React.useState<number>(0);

  useEffect(() => {
    if (userInfo == null) return;
    const today = new Date().toISOString().slice(0, 10);
    setUsage_ofUserInfo(today == userInfo.last_use ? userInfo.usage_today : 0);
    setLimit_ofUserInfo(userInfo.daily_limit);
  }, [userInfo]);

  useEffect(() => {
    supabaseClient.getUserInfo().then(({ data: user }) => {
      setUserInfo(user);
    });
  }, []);

  return (
    <div className="mb-10">
      <h1 className="text-xl font-bold my-5 text-center"> Usage </h1>
      Usage limit: {limit_ofUserInfo} queries per day
      <br />
      Today&apos;s usage: {usage_ofUserInfo} / {limit_ofUserInfo}
      <br />
      <br />
      Usage is reset at 12:00AM UTC
      <br />
    </div>
  );
}

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <header>
        <NavIcon />
        <div className="absolute top-0 left-0"><TopBar /></div>
        
      </header>
      
      <UsageDisaply />
      <PasswordReset />

      <div className="bottom-7 absolute text-sm text-blue-700 underline">
        {" "}
        <Link href="./privacy">Privacy Policy</Link>
      </div>
    </div>
  );
}
