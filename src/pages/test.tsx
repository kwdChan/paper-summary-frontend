import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { supabaseClient } from "@/lib/supabaseClient";
export default function Page() {
  const [data, setData] = React.useState<any>(null);

  async function test() {
    // supabaseClient.highlightSummaryFunctionStreamed(
    //   229, "One sentence", setData
    // )

    const response =  await supabaseClient.customInvoke("https://mbjyxjgolhbfbkcnocdu.functions.supabase.co/SSE_test" ,{})
    const reader = response!.body!.getReader();
    const decoder = new TextDecoder();

    let fullResponse: string = ""
    while (true) {
      console.log(fullResponse)
      const { value, done } = await reader.read();

      if (done) {
        break;
      }
      const lines = decoder.decode(value).split("\n");
      lines
        .filter((line) => line.startsWith("data: "))
        .map(
          (line) => {
            console.log(line)
          }
        )
    }
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
