import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Dispatch, SetStateAction } from "react";
import { Article, Highlight, HighlightQuery } from "./types";

const SUPABASE_URL: string = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY: string = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";

//export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);



class MySupabaseClient  {
  client: SupabaseClient;

  constructor() {
    this.client = createClient(SUPABASE_URL, SUPABASE_KEY)
  }
  
  signIn (email: string, password: string) {
    return this.client.auth.signInWithPassword({ email, password });
  }
  refreshSession () {
    return this.client.auth.refreshSession();
  }

  signout () {
    return this.client.auth.signOut();
  }

  getArticle (article_digest: string) {
    return this.client.from("article").select<string, Article>("*").eq(
      "digest",
      article_digest,
    ).single();
  }


  deleteArticle(article_ids: number[]) {
    return this.client.from("article").delete().in("id", article_ids).then(()=>{console.log("deleted")});
  }

  getHighlightQueries (highlight_id: number) {
    return this.client.from("highlight_query").select<string, HighlightQuery>("*").eq(
      "highlight_id",
      highlight_id,
    ) .order('created_at', { ascending: true });
    ;
  }
  monitorHighlightQueries (highlight_id: number, setHighlightQueries: Dispatch<SetStateAction<HighlightQuery[]>>) {
    
    const handleChanges = (payload: any) => {
      console.log("monitorHighlightQueries", payload);

      this.getHighlightQueries(highlight_id).then(
        ({ data, error }) => {
          if (error) return;
          setHighlightQueries(data);
        },
      );
    };
    handleChanges({});


    this.client
      .channel("any")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "highlight_query",
          filter: `highlight_id=eq.${highlight_id}`,
        },
        handleChanges,
      )
      .subscribe();
  }

  getHighlights (article_digest: string) {
    return this.client.from("highlight").select<string, Highlight>("*").eq(
      "article_digest",
      article_digest,
    ).order('created_at', { ascending: true });;
  }


  getHighlightsOfArticle (article_digest: string) {
    return this.client.from("highlight")
      .select<string, Highlight>("*")
      .eq("article_digest", article_digest).order('created_at', { ascending: true });;
  }

  monitorHighlightsOfArticle (article_digest: string, setHighlights: Dispatch<SetStateAction<Highlight[]>>) {
    const handleChanges = (payload: any) => {
      console.log("monitorHighlightsOfArticle", payload);

      this.getHighlightsOfArticle(article_digest).then(
        ({ data, error }) => {
          if (error) return;
          setHighlights(data);
        },
      );
    };
    handleChanges({});

    this.client
      .channel("any")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "highlight",
          filter: `article_digest=eq.${article_digest}`,
        },
        handleChanges,
      )
      .subscribe();
  }

  monitorArticleList (setArticleList: Dispatch<SetStateAction<Article[]>>) {


    const handleChanges = (payload: any) => {
      console.log("monitorArticleList");
  
      console.log("monitorArticleList", payload);
  
      this.client.from("article").select<string, Article>("*").order('created_at', { ascending: true }).then(
        ({ data, error }) => {
          if (error) return;
          setArticleList(data);
        },
      );
    };
    // fetch once first
    handleChanges({});
  
    this.client
      .channel("any")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "article" },
        handleChanges,
      )
      .subscribe();
  }



  highlightSummaryFunction(
    highlight_id: number,
    summaryMode: string,
  ) {
    interface HighlightSummaryReturn {
      summary: string;
      query_id: number;
    }
    return this.client.functions.invoke<HighlightSummaryReturn>(
      "summarise_highlight",
      {
        body: JSON.stringify({
          highlight_id: highlight_id,
          summaryMode: summaryMode,
          summaryModeVersion: "summaryModeV0",
        }),
      },
    );
  }
  
  highlightQuestionFunction(
    highlight_id: number,
    question: string,
  ) {
    interface HighlightQuestionReturn {
      answer: string;
      query_id: number;
    }
    return this.client.functions.invoke<HighlightQuestionReturn>(
      "question_highlight",
      {
        body: JSON.stringify({
          highlight_id: highlight_id,
          question: question,
        }),
      },
    );
  }
  
  getAllHighlightSummary(
    highlight_id: number,
  ) {
    return this.client.from("highlight_query").select("*").eq(
      "highlight_id",
      highlight_id,
    );
  }
  
}

export const supabaseClient = new MySupabaseClient()

