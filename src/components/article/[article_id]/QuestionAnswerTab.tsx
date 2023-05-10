import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import {
  Article,
  Highlight,
  HighlightQuery
} from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import React from "react";
import { textWithLineBreak } from "../../../lib/textWithLineBreak";

function MyDisclosure({
  title, content, defaultOpen,
}: {
  title: string;
  content: string;
  defaultOpen: boolean;
}) {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 my-1 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
            <span>{title}</span>
            <ChevronUpIcon
              className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-purple-500`} />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
            {textWithLineBreak(content, "mb-2 text-black")}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
export function QuestionAnswerTab({
  article, highlights, selectedHighlight, selectedHighlightSummaries,
}: {
  article: Article;
  highlights: Highlight[];
  selectedHighlight: Highlight | null;
  selectedHighlightSummaries: HighlightQuery[];
}) {
  const [question, setQuestion] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [latestAnswer, setLatestAnswer] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyPress = (event: { keyCode: number; }) => {
      //console.log(inputRef)
      if (event.keyCode === 13 && document.activeElement === inputRef.current) {
         sendButtonRef.current?.click();
      }
    };

    inputRef.current?.addEventListener('keyup', handleKeyPress);

    return () => {
      inputRef.current?.removeEventListener('keyup', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    setLatestAnswer(selectedHighlightSummaries[selectedHighlightSummaries.length - 1]?.answer || "");
  }, [selectedHighlightSummaries]);
  
  const sendQuestion = () => {
    if (!selectedHighlight) {
      console.log("no highlight selected");
      setErrorMsg("Error: no highlight selected");
      return;
    }
    console.log(question);

    const questionToSend = question;
    setQuestion("");
    //setLoading(true);
    
    supabaseClient
      .highlightQuestionFunctionStreamed(selectedHighlight.id, questionToSend, setLatestAnswer, setErrorMsg)
      
  };

  return (
    <>
      <div className="">
        {errorMsg}
        {selectedHighlightSummaries
          .filter((data) => data.type === "question")
          .slice(0, -1)
          .map((data, idx) => (
            <MyDisclosure
              key={idx}
              title={data.query}
              content={data.answer || ""}
              defaultOpen={false} />
          ))}
        {selectedHighlightSummaries
          .filter((data) => data.type === "question")
          .slice(-1)
          .map((data, idx) => (
            <MyDisclosure
              key={idx}
              title={data.query}
              content={latestAnswer}
              defaultOpen={true} />
          ))}
        <div className="h-screen"> </div>
      </div>

      <div
        className={"focus:outline-none absolute bottom-0 left-0 w-full border-t p-3 " +
          (loading ? "bg-gray-300" : "bg-white")}
      >
        <textarea
          placeholder="Send a message..."
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
          }}
          className="h-20 focus:outline-none m-0 group w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2"
          ref={inputRef}
        ></textarea>

        <button
          className="absolute my-2 bottom-7 rounded-md text-gray-500 p-2 hover:bg-gray-100 enabled:dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent  right-4  disabled:opacity-40"
          onClick={sendQuestion}
          disabled={loading}
          ref={sendButtonRef}
        >
          {loading ? "sending" : "send"}
        </button>
      </div>
    </>
  );
}
