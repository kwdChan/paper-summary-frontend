import { NavIcon } from "@/components/navIcon";
import { Article, HighlightQuery } from "@/lib/types";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import {supabaseClient, getAllHighlightSummary} from "@/lib/supabaseClient"

export default function Page() {
  //const [{ data, error, fetching }, reexecute] = useRealtime<Article>('article')
  //const router = useRouter()

  const [data, setData] = React.useState<any>(null);

  function test() {
    getAllHighlightSummary(supabaseClient, 12).then(
        ({data, error}) => {
          console.log(data, error);
          setData(data);
        }
    )


    // highlightSummaryFunction(client, 12, 'Main findings').then((data) => {
    //   console.log(data);
    //   setData(data);
    // });
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
