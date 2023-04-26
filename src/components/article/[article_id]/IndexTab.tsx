import { Article, Highlight } from "@/lib/types";
import { SetStateAction, Dispatch } from "react";
import React from "react";

export function IndexTab({
  article,
  highlights,
  selectedHighlight,
  setSelectedHighlight,
}: {
  article: Article;
  highlights: Highlight[];
  selectedHighlight: Highlight | null;
  setSelectedHighlight: Dispatch<SetStateAction<Highlight | null>>;
}) {
  return (
    <div className="w-full py-7 pl-7 pr-2">
      <h2 className="text-xl font-semibold ">Highlighted: </h2>

      <ol>
        {highlights.map((highlight) => (
          <li
            key={highlight.id}
            className="hover:bg-fuchsia-100 hover:cursor-pointer h-9 rounded-md  p-2 overflow-hidden relative"
            onClick={() => setSelectedHighlight(highlight)}
          >

            <div>- {highlight.text || 'N/A'}</div>
            <div className="absolute  right-0 top-0 w-5/12 h-14 bg-gradient-to-r from-transparent to-white"></div>
          </li>
        ))}
      </ol>
      <br></br>
      <br></br>

      <h2 className="text-xl font-semibold ">Selected: </h2>
      <div className='mr-7'><p>{selectedHighlight?.text}</p></div>
    </div>
  );
}
