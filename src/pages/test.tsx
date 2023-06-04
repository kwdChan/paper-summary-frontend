import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { supabaseClient } from "@/lib/supabaseClient";

import {WarningBox} from '@/components/MessageBox'


import Example from "@/components/test/test";
export default function Page() {
  const [data, setData] = React.useState<any>(null);
  const [up, setUp] = React.useState<boolean>(false);

  async function test() {
    // supabaseClient.highlightSummaryFunctionStreamed(
    //   229, "One sentence", setData
    // )
    setUp(true);
    const { data, error } = await supabaseClient.client.auth.refreshSession();
  }

  return (
    <div className="relative h-screen border-2">
      
      <WarningBox>error</WarningBox>
      <button className="bg-gray-300 m-2 p-4  rounded-md" onClick={test}>
        Run
      </button>
    </div>
  );
}
