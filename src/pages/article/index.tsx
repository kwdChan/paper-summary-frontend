import { NavIcon } from "@/components/navIcon";
import { Article } from "@/lib/types";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
//import { useRealtime } from 'react-supabase'
import { supabaseClient, monitorArticleList } from "@/lib/supabaseClient";

export default function Page() {
  //const [{ data, error, fetching }, reexecute] = useRealtime<Article>('article')

  const [aricleList, setArticleList] = React.useState<Article[]>([]);

  useEffect(() => {
    monitorArticleList(supabaseClient, setArticleList);
  }, []);

  const router = useRouter();

  useEffect(() => {
    console.log(aricleList);
  }, [aricleList]);

  return (
    <div>
      <header>
        <NavIcon />
      </header>
      <ol>
        {aricleList?.map((article) => (
          <li
            key={article.id}
            className="hover:bg-slate-200 hover:cursor-pointer"
            onClick={() => {
              router.push(`/article/${article.digest}`);
            }}
          >
            {article.title}
          </li>
        ))}
      </ol>
    </div>
  );

  return <></>;
}
