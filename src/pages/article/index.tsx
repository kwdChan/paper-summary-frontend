import { NavIcon, NavIconContext } from "@/components/navIcon";
import { Article } from "@/lib/types";
import { useRouter } from "next/router";
import React, { useEffect, useContext } from "react";
//import { useRealtime } from 'react-supabase'
import { supabaseClient } from "@/lib/supabaseClient";
import Head from "next/head";
import { TopBar } from "@/components/theme/TopBar";

export default function Page() {
  //const [{ data, error, fetching }, reexecute] = useRealtime<Article>('article')

  const { deleteMode, setDeleteMode } = useContext(NavIconContext);

  const [aricleList, setArticleList] = React.useState<Article[]>([]);
  const [checkedArticle, setCheckedArticle] = React.useState<
    Map<number, boolean>
  >(new Map());

  useEffect(() => {
    supabaseClient.refreshSession().then(({ data, error }) => {
      if (error) {
        console.log("refreshSession", error);
        router.push("/signin");
      }
    });

    supabaseClient.monitorArticleList(setArticleList);
  }, []);

  const router = useRouter();

  useEffect(() => {
    console.log(aricleList);
  }, [aricleList]);

  return (
    <div className="relative">
      <header>
        <NavIcon />
      </header>

      <TopBar>
        <TopBar.Title>Article list</TopBar.Title>
        <DeleteButton deleteMode={deleteMode} checkedArticle={checkedArticle} setDeleteMode={setDeleteMode}/>
      </TopBar>

      <ol>
        {aricleList?.map((article) => (
          <li
            key={article.id}
            className="flex p-3 justify-between items-center border-b-2 hover:bg-slate-200 hover:cursor-pointer "
            onClick={() => {
              if (deleteMode) {
                let newMap = new Map(checkedArticle);
                newMap.has(article.id)
                  ? newMap.delete(article.id)
                  : newMap.set(article.id, true);
                setCheckedArticle(newMap);
              } else {
                router.push(`/article/${article.digest}`);
              }
            }}
          >
            <div className="w-11/12 "> {article.title}</div>
            <div className="flex left-2 mx-3 h-5 w-5 items-center">
              {deleteMode && (
                <input
                  className="hover:cursor-pointer h-5 w-5"
                  type="checkbox"
                  checked={checkedArticle.has(article.id)}
                ></input>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function DeleteButton(

  {deleteMode, checkedArticle, setDeleteMode}:
  {deleteMode: boolean, 
  checkedArticle: Map<number, boolean>, 
  setDeleteMode: React.Dispatch<React.SetStateAction<boolean>>}
  ) {
  return <div className="flex absolute right-24 mx-10 h-5 w-5 items-center">
    {deleteMode && (
      <button
        onClick={() => {
          console.log("delete clicked");
          supabaseClient.deleteArticle(Array.from(checkedArticle.keys()));
          setDeleteMode(false);
        } }
        className="bg-red-500 hover:cursor-pointer rounded-md p-2 text-sm"
      >
        DELETE
      </button>
    )}
  </div>;
}

