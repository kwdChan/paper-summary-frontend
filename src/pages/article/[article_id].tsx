import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'

import { useRouter } from "next/router";
import {
  Article,
  Highlight,
  HighlightQuery,
  SummaryType,
  allSummaryType,
} from "@/lib/types";
import { NavIcon } from "@/components/navIcon";
import { Menu, Transition } from "@headlessui/react";

//import React from 'react';
import { Fragment, useState, useEffect, SetStateAction, Dispatch } from "react";
import { Tab, Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import {
  supabaseClient,
  getArticle,
  monitorHighlightsOfArticle,
  getHighlight,
  monitorHighlightQueries,
  highlightSummaryFunction,
  highlightQuestionFunction
} from "@/lib/supabaseClient";


function MyDisclosure({title, content}:{title: string, content: string}){

  return (
  <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                <span>{title}</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                {content}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>)
}



function QuestionAnswerTab({
  article,
  highlights,
  selectedHighlight,
  selectedHighlightSummaries,
}: {
  article: Article;
  highlights: Highlight[];
  selectedHighlight: Highlight | null;
  selectedHighlightSummaries: HighlightQuery[];
}) {
  const [question, setQuestion] = useState<string>("");

  const sendQuestion = () => {
    if (!selectedHighlight) {console.log('no highlight selected'); return};


    console.log(question);

    highlightQuestionFunction(supabaseClient, selectedHighlight.id, question).then(
      (result) => {
        if (result.error) {console.log( result); return}
        console.log("answer", result.data?.answer);
      }
    )
  };

  return (
    <>
      <div>
        {selectedHighlightSummaries
          .filter((data) => data.type === "question")
          .map((data, idx) => (

            <MyDisclosure title={data.query} content={data.answer} />


          ))}



      </div>

      <div className=" focus:outline-none absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2">
        <textarea
          placeholder="Send a message..."
          onChange={(e) => {
            setQuestion(e.target.value);
          }}
          className=" focus:outline-none m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"
        ></textarea>

        <button
          className="absolute p-1 rounded-md text-gray-500 bottom-1.5 md:bottom-2.5 hover:bg-gray-100 enabled:dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent right-1 md:right-2 disabled:opacity-40"
          onClick={sendQuestion}
        >
          send{" "}
        </button>
      </div>
    </>
  );
}

function SummaryTab({
  article,
  highlights,
  selectedHighlight,
  selectedHighlightSummaries,
}: {
  article: Article;
  highlights: Highlight[];
  selectedHighlight: Highlight | null;
  selectedHighlightSummaries: HighlightQuery[];
}) {
  const [summaryModeList, setSummaryModeList] =
    useState<Array<SummaryType>>(allSummaryType);
  const [selectedSummaryMode, setselectedSummaryMode] = useState(
    summaryModeList[0]
  );
  const [summaryResponse, setSummaryResponse] = useState<string>("");

  const onSelection = (selectedMode: SummaryType) => {
    if (!selectedHighlight) return;

    setselectedSummaryMode(selectedMode);

    const match = selectedHighlightSummaries.filter(
      (highlightQuery) =>
        highlightQuery.query === selectedMode && highlightQuery.answer
    );

    if (match.length) {
      setSummaryResponse(match[0].answer);
      return;
    }

    console.log(selectedHighlightSummaries);

    //TODO: (add a allow user to generate the response)
    highlightSummaryFunction(
      supabaseClient,
      selectedHighlight.id,
      selectedMode
    ).then(({ data, error }) => {
      if (error) {
        console.log(error);
        return;
      }
      setSummaryResponse(data!.summary);
    });
  };
  return (
    <>
      <Listbox
        as="div"
        className="w-72 mt-5"
        value={selectedSummaryMode}
        onChange={onSelection}
      >
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate">{selectedSummaryMode}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
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
                    active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                  }`
                }
                value={summaryMode}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
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

      <div className="w-full px-0">{summaryResponse}</div>
    </>
  );
}

function IndexTab({
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
    <div className="w-full px-0">
      <h2 className="text-xl font-semibold">Highlights: </h2>

      <ol>
        {highlights.map((highlight) => (
          <li
            key={highlight.id}
            className="hover:bg-fuchsia-200 hover:cursor-pointer"
            onClick={() => setSelectedHighlight(highlight)}
          >
            {highlight.id}: {highlight.text.slice(0, 20)}
          </li>
        ))}
      </ol>
      <br></br>
      <br></br>

      <h2 className="text-xl font-semibold">Selected: </h2>
      {selectedHighlight?.text}
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
  selectedHighlight,
  setSelectedHighlight,
  selectedHighlightSummaries,
}: {
  article: Article;
  highlights: Highlight[];
  selectedHighlight: Highlight | null;
  setSelectedHighlight: Dispatch<SetStateAction<Highlight | null>>;
  selectedHighlightSummaries: HighlightQuery[];
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
            {
              <IndexTab
                article={article}
                highlights={highlights}
                selectedHighlight={selectedHighlight}
                setSelectedHighlight={setSelectedHighlight}
              />
            }
          </Tab.Panel>
          <Tab.Panel>
            {
              <SummaryTab
                article={article}
                highlights={highlights}
                selectedHighlight={selectedHighlight}
                selectedHighlightSummaries={selectedHighlightSummaries}
              />
            }
          </Tab.Panel>
          <Tab.Panel>
            {
              <QuestionAnswerTab
                article={article}
                highlights={highlights}
                selectedHighlight={selectedHighlight}
                selectedHighlightSummaries={selectedHighlightSummaries}
              />
            }
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default function DataHolder() {
  const router = useRouter();
  const { article_id, highlight_id } = router.query;
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
    if (typeof article_id === "string") {
      getArticle(supabaseClient, parseInt(article_id)).then(
        ({ data, error }) => {
          if (error) {
            console.log(error);
            return;
          }
          setArticle(data);
        }
      );
    }
  }, [article_id]);

  useEffect(() => {
    if (article.digest === "placeholder") return;
    monitorHighlightsOfArticle(supabaseClient, article.digest, setHighlights);
    console.log("highlights", highlights);
  }, [article.digest]);

  useEffect(() => {
    if (typeof highlight_id === "string") {
      getHighlight(supabaseClient, parseInt(highlight_id)).then(
        ({ data, error }) => {
          if (error) {
            console.log(error);
            return;
          }
          setSelectedHighlight(data);
        }
      );
    }
  }, [highlight_id]);

  useEffect(() => {
    if (selectedHighlight) {
      monitorHighlightQueries(
        supabaseClient,
        selectedHighlight.id,
        setSelectedHighlightSummaries
      );
    }
  }, [selectedHighlight]);

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
