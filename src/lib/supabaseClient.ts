import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Dispatch, SetStateAction } from "react";
import { Article, Highlight, HighlightQuery } from "./types";

const SUPABASE_URL: string = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY: string = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

export function signIn(
  client: SupabaseClient,
  email: string,
  password: string,
) {
  return client.auth.signInWithPassword({ email, password });
}

export function getArticle(client: SupabaseClient, article_id: number) {
  return client.from("article").select<string, Article>("*").eq(
    "id",
    article_id,
  ).single();
}

export function getHighlightQueries(client: SupabaseClient, highlight_id: number) {
  return client.from("highlight_query").select<string, HighlightQuery>("*").eq(
    "highlight_id",
    highlight_id,
  )
}


export function monitorHighlightQueries(
  client: SupabaseClient,
  highlight_id: number,
  setHighlightQueries: Dispatch<SetStateAction<HighlightQuery[]>>,
) {
  const handleChanges = (payload: any) => {
    console.log('monitorHighlightQueries', payload);

    getHighlightQueries(client, highlight_id).then(
      ({ data, error }) => {
        if (error) return;
        setHighlightQueries(data);
      },
    );
  };
  handleChanges({});

  client
    .channel("any")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "highlight_query",  filter:`highlight_id=eq.${highlight_id}`},
      handleChanges,
    )
    .subscribe();
}





export function getHighlight(client: SupabaseClient, highlight_id: number) {
  return client.from("highlight").select<string, Highlight>("*").eq(
    "id",
    highlight_id,
  ).single();
}

export function getHighlightsOfArticle(
  client: SupabaseClient,
  article_digest: string,
) {
  return client.from("highlight")
    .select<string, Highlight>("*")
    .eq("article_digest", article_digest);
}

export function monitorHighlightsOfArticle(
  client: SupabaseClient,
  article_digest: string,
  setHighlights: Dispatch<SetStateAction<Highlight[]>>,
) {
  const handleChanges = (payload: any) => {
    console.log('monitorHighlightsOfArticle', payload);

    getHighlightsOfArticle(client, article_digest).then(
      ({ data, error }) => {
        if (error) return;
        setHighlights(data);
      },
    );
  };
  handleChanges({});

  client
    .channel("any")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "highlight", filter:`article_digest=eq.${article_digest}`},
      handleChanges,
    )
    .subscribe();
}

export function monitorArticleList(
  client: SupabaseClient,
  setArticleList: Dispatch<SetStateAction<Article[]>>,
) {
  const handleChanges = (payload: any) => {
    console.log('monitorArticleList', payload);

    client.from("article").select<string, Article>("*").then(
      ({ data, error }) => {
        if (error) return;
        setArticleList(data);
      },
    );
  };
  // fetch once first
  handleChanges({});

  client
    .channel("any")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "article" },
      handleChanges,
    )
    .subscribe();
}




export function highlightSummaryFunction(
  client: SupabaseClient,
  highlight_id: number,
  summaryMode: string,
) {

  interface HighlightSummaryReturn {
    summary: string;
    query: number;
  }
  return client.functions.invoke<HighlightSummaryReturn>("summarise_highlight", {
    body: JSON.stringify({
      highlight_id: highlight_id,
      summaryMode: summaryMode,
      summaryModeVersion: "summaryModeV0",
    }),
  });
}

export function getAllHighlightSummary(
  client: SupabaseClient,
  highlight_id: number,
) {
  return client.from("highlight_query").select("*").eq(
    "highlight_id",
    highlight_id,
  );
}
