
import { useRouter } from "next/router";
import React, { useEffect } from "react";


export default function Page() {
  //const [{ data, error, fetching }, reexecute] = useRealtime<Article>('article')
  //const router = useRouter()

  const [data, setData] = React.useState<any>(null);

  function test() {
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
