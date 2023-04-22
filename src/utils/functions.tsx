import { SupabaseClient } from "@supabase/supabase-js";

export function highlightSummaryFunction(
  client: SupabaseClient,
  highlight_id: number,
  summaryMode: string
) {
  return client.functions.invoke<string>("summarise_highlight", {
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
    return client.from('highlight_query').select('*').eq(
        'highlight_id', highlight_id)
  }
  