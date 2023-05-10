import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { supabaseClient } from "@/lib/supabaseClient";
export default function Page() {
  const [data, setData] = React.useState<any>(null);

  async function test() {
    // supabaseClient.highlightSummaryFunctionStreamed(
    //   229, "One sentence", setData
    // )
    const userID = (await supabaseClient.client.auth.getSession()).data.session!.user.id

    const response =  await supabaseClient.client.rpc("query_highlight", {highlight_id: 131})
   
    console.log(response)
    setData(response)

  }

  return (
    <div className="flex flex-col h-screen">
      <p className="w-screen overflow-auto">{JSON.stringify(data)}</p>

      <button className="bg-gray-300 m-3 p-4  rounded-md" onClick={test}>
        Run
      </button>
    </div>
  );
}
