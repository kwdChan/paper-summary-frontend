import {
  Article,
  Highlight,
  HighlightQuery,
  SummaryType,
  allSummaryType
} from "@/lib/types";
import { Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  ArrowPathIcon
} from "@heroicons/react/20/solid";
import { supabaseClient } from "@/lib/supabaseClient";
import React from "react";
import { textWithLineBreak } from "../../../lib/textWithLineBreak";

export function SummaryTab({
  article, highlights, selectedHighlight, selectedHighlightSummaries,
}: {
  article: Article;
  highlights: Highlight[];
  selectedHighlight: Highlight | null;
  selectedHighlightSummaries: HighlightQuery[];
}) {
  const [summaryModeList, setSummaryModeList] = useState<Array<SummaryType>>(allSummaryType);
  const [selectedSummaryMode, setSelectedSummaryMode] = useState(
    summaryModeList[0]
  );
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [summaryResponse, setSummaryResponse] = useState<string>("");
  const [queryToAnswer, setQueryToAnswer] = useState<Map<String, string>>(
    new Map()
  );
  const listboxButtonRef = React.useRef<HTMLButtonElement>(null);

  const assignSummaryToQuery = (query: string, answer: string) => {
    const newQueryToAnswer = new Map(queryToAnswer);
    newQueryToAnswer.set(query, answer);

    //console.log("assignSummaryToQuery", newQueryToAnswer);
    setQueryToAnswer(newQueryToAnswer);
  };

  useEffect(() => {
    listboxButtonRef.current?.click();
  }, []);

  useEffect(() => {
    setSummaryResponse(queryToAnswer.get(selectedSummaryMode) || "");
  }, [queryToAnswer, selectedSummaryMode]);

  const sendSummaryRequest = (selectedMode: string) => {
    if (!selectedHighlight)
      return;

    setErrorMsg("");
    assignSummaryToQuery(selectedMode, "");

    supabaseClient.highlightSummaryFunctionStreamed(
      selectedHighlight.id, selectedMode, (res:string)=>{assignSummaryToQuery(selectedMode, res)}, (res:string)=>{setErrorMsg(res); console.log(res)}
    )
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
        assignSummaryToQuery(
          selectedMode,
          matchedQueries.slice(-1)[0].answer || ""
        );
        return;
      } else {
        setErrorMsg("");
        assignSummaryToQuery(
          selectedMode,
          "Please reload if no response in a few seconds"
        );
      }
    }

    //TODO: (add a allow user to generate the response)
    sendSummaryRequest(selectedMode);
  };
  return (
    <>
      <div className="flex items-center w-11/12 mt-5 mx-auto">
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
                aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-screen w-10/12 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {summaryModeList.map((summaryMode, idx) => (
                <Listbox.Option
                  key={idx}
                  className={({ active }) => `relative  hover:cursor-pointer  select-none py-2 pl-10 pr-4 ${active ? "bg-amber-100 text-amber-900" : "text-gray-900"}`}
                  value={summaryMode}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
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
          onClick={() => sendSummaryRequest(selectedSummaryMode)}
        >
          <ArrowPathIcon className="h-5 text-slate-500" />
        </div>
      </div>

      <div className="w-full p-7">
        {errorMsg && <div className="text-center">{errorMsg}</div>}
        {textWithLineBreak(summaryResponse, "my-3")}
      </div>
    </>
  );
}
