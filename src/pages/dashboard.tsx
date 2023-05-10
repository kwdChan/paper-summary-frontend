import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { NavIcon } from "@/components/navIcon";
import { UserInfo } from "@/lib/types";

export default function Page() {
  const [userInfo, setUserInfo] = React.useState<UserInfo|null>(null);

  // these should only be set by the useEffect of data
  const [usage_ofUserInfo, setUsage_ofUserInfo] = React.useState<number>(0);
  const [limit_ofUserInfo, setLimit_ofUserInfo] = React.useState<number>(0);
  const [lastUse_ofUserInfo, setLastUse_ofUserInfo] = React.useState<string>('');

  useEffect(() => {

    if (userInfo == null) return;

    const today = new Date().toISOString().slice(0, 10)


    setUsage_ofUserInfo(today==userInfo.last_use? userInfo.usage_today: 0)
    setLimit_ofUserInfo(userInfo.daily_limit)
    

  }, [userInfo]);

  
  useEffect(() => {
    supabaseClient.getUserInfo().then(({ data: user }) => {
      setUserInfo(user);
    });
  }, []);

  return (
    <div className="relative flex flex-col w-screen h-screen overflow-x-hidden overflow-y-scroll scroll">
      <header>
        <NavIcon />
      </header>
      <div className="absolute  bg-blue-500 text-white h-14 w-screen p-1">
                
      </div>


      <div className="flex w-full h-full border-0 border-black justify-center">

        <div className="self-center border-0 border-black ">        
        Usage limit: {limit_ofUserInfo} queries per day<br/>
        Today&apos;s usage: {usage_ofUserInfo} / {limit_ofUserInfo}<br/><br/>
        Usage is reset at 12:00AM UTC<br/>
        </div>

      </div>


    </div>
  );
}
