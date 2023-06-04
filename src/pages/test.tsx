import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { supabaseClient } from "@/lib/supabaseClient";
import Example from "@/components/test/test";
export default function Page() {
  const [data, setData] = React.useState<any>(null);

  async function test() {
    // supabaseClient.highlightSummaryFunctionStreamed(
    //   229, "One sentence", setData
    // )
    const { data, error } = await supabaseClient.client.auth.refreshSession()

  }

  return (
    <div className="flex flex-col h-screen ">
      <p className="w-screen overflow-auto">{JSON.stringify(data)}</p>
      <Example/>
      <button className="bg-gray-300 m-3 p-4  rounded-md" onClick={test}>
        Run
      </button>
    </div>
  );
}
