import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
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
import {
  CheckIcon,
  ChevronUpDownIcon,
  ArrowPathIcon,
} from "@heroicons/react/20/solid";
import { supabaseClient } from "@/lib/supabaseClient";
import React from "react";

function textWithLineBreak(text: string, className:string) {


  return (
    <Fragment>{text.split("\n").map((line, idx) => (
      <p className={className} key={idx}>
        {line}<br/>
      </p>
      
    ))}</Fragment>
  )
}

function MyDisclosure({ title, content, defaultOpen }: { title: string; content: string, defaultOpen:boolean }) {
  return (
    <Disclosure defaultOpen={defaultOpen} >
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 my-1 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
            <span>{title}</span>
            <ChevronUpIcon
              className={`${
                open ? "rotate-180 transform" : ""
              } h-5 w-5 text-purple-500`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
            {textWithLineBreak(content, "mb-2 text-black")}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
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
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);


  const sendQuestion = () => {
    if (!selectedHighlight) {
      console.log("no highlight selected");
      setErrorMsg("Error: no highlight selected")
      return;
    }
    console.log(question);

    const questionToSend = question
    setQuestion("")
    setLoading(true)
    supabaseClient
      .highlightQuestionFunction(selectedHighlight.id, questionToSend)
      .then((result) => {
        setLoading(false)
        if (result.error) {
          console.log(result);
          setErrorMsg("error: cannot fullfull the request");
          return;
        }
        console.log("answer", result.data?.answer);
      });
  };

  return (
    <>
      <div className=''>
        {errorMsg}
        {selectedHighlightSummaries.filter((data) => data.type === "question").slice(0, -1)
          .map((data, idx) => (
            <MyDisclosure key={idx} title={data.query} content={data.answer||""} defaultOpen={false}/>
          ))}
        {selectedHighlightSummaries.filter((data) => data.type === "question").slice(-1).map((data, idx) => (
            <MyDisclosure key={idx} title={data.query} content={data.answer||""} defaultOpen={true}/>
          ))}
          <div className="h-screen"> {' '}</div>

      </div>

      <div className={"focus:outline-none absolute bottom-0 left-0 w-full border-t p-3 "+(loading?"bg-gray-300":"bg-white")}>
        <textarea
          placeholder="Send a message..."
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
          }}
          className="h-20 focus:outline-none m-0 group w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2"
        ></textarea>

        <button
          className="absolute my-2 bottom-7 rounded-md text-gray-500 p-2 hover:bg-gray-100 enabled:dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent  right-4  disabled:opacity-40"
          onClick={sendQuestion}
          disabled={loading}
        >
          {loading?"sending":"send"}
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
  const [selectedSummaryMode, setSelectedSummaryMode] = useState(
    summaryModeList[0]
  );
  const [summaryResponse, setSummaryResponse] = useState<string>("");
  const [loading, setLoading] = useState<number>(0);
  const [errorred, setErrorred] = useState<boolean>(false);
  const [queryToAnswer, setQueryToAnswer] = useState<Map<String, string>>(
    new Map()
  );
  const listboxButtonRef = React.useRef<HTMLButtonElement>(null);

  const assignSummaryToQuery = (query: string, answer: string) => {
    const newQueryToAnswer = new Map(queryToAnswer);
    newQueryToAnswer.set(query, answer);

    console.log('assignSummaryToQuery', newQueryToAnswer)
    setQueryToAnswer(newQueryToAnswer);
  };

  useEffect(() => {
    listboxButtonRef.current?.click();
  }, []);


  useEffect(() => {
    setSummaryResponse(queryToAnswer.get(selectedSummaryMode) || "")
  }, [queryToAnswer, selectedSummaryMode]);




  const sendSummaryRequest = (selectedMode:string) => {
    if (!selectedHighlight) return;

    setErrorred(false);
    setLoading(loading+1);
    assignSummaryToQuery(selectedMode, "");

    supabaseClient
      .highlightSummaryFunction(selectedHighlight.id, selectedMode)
      .then(({ data, error }) => {
        setLoading(loading-1);
        if (error) {
          setErrorred(true);
          console.log(error);
          return;
        }
        assignSummaryToQuery(selectedMode, data!.summary);
      });
  };

  const onSelection = (selectedMode: SummaryType) => {
    //TODO: show warning message

    setSelectedSummaryMode(selectedMode);

    if (!selectedHighlight) {
      assignSummaryToQuery(selectedMode, "No highlight was selected");
      return;
    }

    const matchedQueries = selectedHighlightSummaries.filter(
      (highlightQuery) => highlightQuery.query === selectedMode
    );

    // if the query has been sent before
    if (matchedQueries.length) {
      if (matchedQueries.slice(-1)[0].answer) {
        assignSummaryToQuery(selectedMode, matchedQueries.slice(-1)[0].answer||'');
        return;
      } else {
        setErrorred(false);
        assignSummaryToQuery(selectedMode, "Please reload if no response in a few seconds");
      }
    }

    //TODO: (add a allow user to generate the response)
    sendSummaryRequest(selectedMode);
  };
  return (
    <>
      <div className="flex w-11/12 mt-5 mx-auto">
        <Listbox
          className="w-10/12 m-auto"
          as="div"
          value={selectedSummaryMode}
          onChange={onSelection}
        >
          <Listbox.Button
            ref={listboxButtonRef}
            className="relative w-full cursor-default rounded-lg hover:cursor-pointer bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          >
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
            <Listbox.Options className="absolute mt-1 max-h-60 w-10/12 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {summaryModeList.map((summaryMode, idx) => (
                <Listbox.Option
                  key={idx}
                  className={({ active }) =>
                    `relative  hover:cursor-pointer  select-none py-2 pl-10 pr-4 ${
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

        <div
          className="m-auto rounded-md border-2 px-3 py-1 hover:bg-slate-200 hover:cursor-pointer"
          onClick={()=>sendSummaryRequest(selectedSummaryMode)}
        >
          <ArrowPathIcon className="h-5 text-slate-500" />
        </div>
      </div>

      <div className="w-full p-7">
        {errorred && <div className="text-center">An error occured</div>}
        {loading ? <div className="text-center">loading...</div>:null}
        {textWithLineBreak(summaryResponse,'my-3')}
        
      </div>
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
    <div className="w-full  p-7">
      <h2 className="text-xl font-semibold ">Highlights: </h2>

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

      <h2 className="text-xl font-semibold ">Selected: </h2>
      <p>{selectedHighlight?.text}</p>
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
  const [selectedTabIndex, setSelectedTabIndex] = useState(1);

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
        router.push("/signin");
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
    <div className="w-screen h-screen  overflow-x-hidden overflow-y-scroll scroll">
      <header>
        <NavIcon />
      </header>

      <div className="relative bg-blue-500 text-white h-14 w-screen overflow-ellipsis p-1">
        <div className="h-6 overflow-clip w-11/12">
          <b>{article.title}</b>
        </div>
        <div className="absolute  right-0 top-0 w-5/12 h-14 bg-gradient-to-r from-transparent to-blue-500"></div>
        Focus: {selectedHighlight?.digest || "None"}
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
