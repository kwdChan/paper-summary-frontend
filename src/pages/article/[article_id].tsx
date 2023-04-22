//import Image from 'next/image'
import {
  useSignIn,
  useAuthStateChange,
  useRealtime,
  useFilter,
  useClient
} from "react-supabase";
import type { Filter } from "react-supabase";

import { useRouter } from "next/router";
import { Article, Highlight, SummaryType, allSummaryType } from "@/utils/types";
import { NavIcon } from "@/components/navIcon";
import { Menu, Transition } from "@headlessui/react";

//import React from 'react';
import { Fragment, useState, useEffect } from "react";
import { Tab, Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'


function Tester(){
  const client = useClient()
  useEffect(()=>{

    client.functions.invoke('summarise', {
      body:JSON.stringify({article_id: '47'})
      
    
    }).then((data) => {
      console.log(data)
    })
  }, [])


  return (<></>)
}

function SummaryTab({
    article,
    highlights,
  }: {
    article: Article;
    highlights: Highlight[]; 
  }) 
  {
    const [summaryModeList, setSummaryModeList] = useState<Array<SummaryType>>(allSummaryType)
    const [selectedSummaryMode, setselectedSummaryMode] = useState(summaryModeList[0])
    const client = useClient()

    useEffect(()=>{
      
    }, 
    
    [selectedSummaryMode])


    return (
        <Listbox as='div' className="w-72 mt-5" value={selectedSummaryMode} onChange={setselectedSummaryMode} >
        <Listbox.Button className='relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>

        <Tester/>
        <span className="block truncate">{selectedSummaryMode}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span></Listbox.Button>
        <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {summaryModeList.map((summaryMode, idx) => (
                <Listbox.Option
                  key={idx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                    }`
                  }
                  value={summaryMode}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {summaryMode}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
      </Listbox>
    );
  }


function IndexTab({
  article,
  highlights,
}: {
  article: Article;
  highlights: Highlight[];
}) {
  return (
    <div className="w-full px-0">
      <ol>
        {highlights.map((highlight) => (
          <li key={highlight.id}>{highlight.id}</li>
        ))}
      </ol>
    </div>
  );
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function TabHeadWrapper({ text }: { text: string }) {
  return (
    <Tab
      className={({ selected }) =>
        classNames(
          "w-full rounded-lg py-1 text-sm font-medium leading-5 text-blue-700",
          "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
          selected
            ? "bg-white shadow"
            : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
        )
      }
    >
      {" "}
      {text}
    </Tab>
  );
}
function TabNav({
  article,
  highlights,
}: {
  article: Article;
  highlights: Highlight[];
}) {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

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
            {<IndexTab article={article} highlights={highlights} />}
          </Tab.Panel>
          <Tab.Panel>{<SummaryTab article={article} highlights={highlights} />}</Tab.Panel>
          <Tab.Panel>{JSON.stringify(highlights)}</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default function DataHolder() {
  const router = useRouter();
  const { article_id, highlight_id } = router.query;
  let article: Article = {
    id: -1,
    user_id: "placeholder",
    created_at: 'placeholder', 
    source: "placeholder",
    title: "placeholder",
    digest: "placeholder",
  };
  let highlights: Array<Highlight> = [];
  


  // get article
  const articleFilter = useFilter(
    (query) => query.eq("id", article_id),
    [article_id]
  );
  const [articleResult, articleReexecute] = useRealtime<Article>("article", {
    select: { filter: articleFilter },
  });
  if (articleResult.data && articleResult.data.length > 0) {
    article = articleResult.data[0];
  }

  // get all highlights for this article
  const highlightFilter = useFilter(
    (query) => query.eq("article_digest", article.digest),
    [article.digest]
  );
  const [highlightResult, highlightReexecute] = useRealtime<Highlight>(
    "highlight",
    { select: { filter: highlightFilter } }
  );

  if (highlightResult.data && highlightResult.data.length > 0) {
    highlights = highlightResult.data;
  }
  return (
    <div>
      <header>
        <NavIcon />
      </header>

      <div className="bg-blue-500 text-white h-14">
        <b>{article.title}</b>
        <br />
        Focus: {highlight_id || "None"}
      </div>
      <TabNav article={article} highlights={highlights} />
      <br />
      <br />
    </div>
  );
}
