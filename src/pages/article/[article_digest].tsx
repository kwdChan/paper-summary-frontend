import { useRouter } from "next/router";
import {
  Article,
  Highlight,
  HighlightQuery,
} from "@/lib/types";
import { NavIcon } from "@/components/navIcon";
import { Menu } from "@headlessui/react";

//import React from 'react';
import { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import React from "react";
import { TabNav } from "../../components/article/[article_id]/TabNav";

export default function DataHolder() {
  const router = useRouter();
  const { article_digest, highlight_digest } = router.query;

  const [uiData, setUiData] = useState<any>({
    summary: { loading: false, highlight_digest: null },
    question: {},
  });

  console.log("DataHolder: router.query", router.query);
  const [article, setArticle] = useState<Article>({
    id: -1,
    user_id: "placeholder",
    created_at: "placeholder",
    source: "placeholder",
    title: "placeholder",
    digest: "placeholder",
  });

  const [highlights, setHighlights] = useState<Highlight[]>([]);

  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(
    null
  );
  
  const [selectedHighlightSummaries, setSelectedHighlightSummaries] = useState<
    HighlightQuery[]
  >([]);

  useEffect(() => {
    supabaseClient.refreshSession().then(({ data, error }) => {
      if (error) {
        console.log("refreshSession", error);
        router.push("/sign-in/passwordless");
      }
    });
  }, []);

  useEffect(() => {
    if (typeof article_digest === "string") {
      supabaseClient.getArticle(article_digest).then(({ data, error }) => {
        if (error) {
          console.log(error);
          return;
        }
        setArticle(data);
      });
    }
  }, [article_digest]);

  //TODO: consider to unsubscribe when unmounted (but not necessary)
  useEffect(() => {
    if (article.digest === "placeholder") return;
    supabaseClient.monitorHighlightsOfArticle(article.digest, setHighlights);
    console.log("DataHolder:highlights", highlights);
  }, [article.digest]);

  useEffect(() => {
    if (typeof highlight_digest === "string") {
      highlights.forEach((eachHighlight) => {
        if (eachHighlight.digest === highlight_digest) {
          setSelectedHighlight(eachHighlight);
        }
      });
    }
  }, [highlights, highlight_digest]);

  useEffect(() => {
    if (selectedHighlight) {
      supabaseClient.monitorHighlightQueries(
        selectedHighlight.id,
        setSelectedHighlightSummaries
      );
    }
  }, [selectedHighlight]);

  return (
    <div className="relative w-screen h-screen overflow-x-hidden overflow-y-scroll scroll">
      <header>
        <NavIcon />
      </header>

      <div className="relative bg-blue-500 text-white h-14 w-screen overflow-clip p-1">
        <div className="h-6 overflow-clip w-11/12">
          <b>{article.title}</b>
        </div>
        <div className="absolute right-0 top-0 w-5/12 h-14 bg-gradient-to-r from-transparent to-blue-500 "></div>
        Focus: {selectedHighlight?.text || "Not selected"}
      </div>
      <TabNav
        article={article}
        highlights={highlights}
        selectedHighlight={selectedHighlight}
        setSelectedHighlight={setSelectedHighlight}
        selectedHighlightSummaries={selectedHighlightSummaries}
      />
      <br />
      <br />
    </div>
  );
}
