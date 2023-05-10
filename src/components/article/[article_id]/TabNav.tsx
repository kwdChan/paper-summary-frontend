import {
  Article,
  Highlight,
  HighlightQuery
} from "@/lib/types";
import { useState, SetStateAction, Dispatch, useEffect } from "react";
import { Tab } from "@headlessui/react";
import React from "react";
import { QuestionAnswerTab } from "./QuestionAnswerTab";
import { SummaryTab } from "./SummaryTab";
import { IndexTab } from "./IndexTab";
import { useRouter } from "next/router";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
function TabHeadWrapper({ text }: { text: string; }) {
  return (
    <Tab
      className={({ selected }) => classNames(
        "w-full rounded-lg py-1 text-sm font-medium leading-5 text-blue-700",
        "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
        selected
          ? "bg-white shadow"
          : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
      )}
    >
      {" "}
      {text}
    </Tab>
  );
}
export function TabNav({
  article, highlights, selectedHighlight, setSelectedHighlight, selectedHighlightSummaries,
}: {
  article: Article;
  highlights: Highlight[];
  selectedHighlight: Highlight | null;
  setSelectedHighlight: Dispatch<SetStateAction<Highlight | null>>;
  selectedHighlightSummaries: HighlightQuery[];
}) {

  const router = useRouter();
  const [selectedTabIndex, setSelectedTabIndex] = useState(selectedHighlight? 1:0);
  const { article_digest, highlight_digest } = router.query;

  useEffect(() => {
    if (highlight_digest && selectedHighlight){
      setSelectedTabIndex(1);
    }
  }, [selectedHighlight, highlight_digest]);


  return (
    <div className="w-full px-0">
      {" "}
      <Tab.Group
        selectedIndex={selectedTabIndex}
        onChange={setSelectedTabIndex}
      >
        <Tab.List className="flex space-x-1 bg-blue-900/20 py-0.5 px-1">
          <TabHeadWrapper text="Index" />
          <TabHeadWrapper text="Summary" />
          <TabHeadWrapper text="Question" />
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            {" "}
            {<IndexTab
              article={article}
              highlights={highlights}
              selectedHighlight={selectedHighlight}
              setSelectedHighlight={setSelectedHighlight} />}
          </Tab.Panel>
          <Tab.Panel>
            {<SummaryTab
              article={article}
              highlights={highlights}
              selectedHighlight={selectedHighlight}
              selectedHighlightSummaries={selectedHighlightSummaries} />}
          </Tab.Panel>
          <Tab.Panel>
            {<QuestionAnswerTab
              article={article}
              highlights={highlights}
              selectedHighlight={selectedHighlight}
              selectedHighlightSummaries={selectedHighlightSummaries} />}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
