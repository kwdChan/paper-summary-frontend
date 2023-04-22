export interface Article {
    id: number,
    created_at: string,
    user_id: string,
    source: string,
    title: string,
    digest: string
}

export interface Highlight {
    id: number,
    created_at: string,
    text: string
    user_id: string,
    article_digest: string, 
    digest: string
}


export interface HighlightQuery {
    id: number,
    created_at: string
    highlight_id: number
    query: string, 
    answer: string,
    type: string,
    user_id: string,
}



export type SummaryType = "One sentence"|"Argments and count-arguments"| "Main findings"

export const allSummaryType: SummaryType[] = [
    "One sentence", "Argments and count-arguments", "Main findings"
]

