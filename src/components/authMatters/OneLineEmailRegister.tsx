import { supabaseClient } from "@/lib/supabaseClient";
import { Spinner } from "@chakra-ui/react";
import React, { InputHTMLAttributes, useEffect, useRef, useState } from "react";

function MyStyledInput({
  id,
  onChange,
  placeholder,
  type,
  errored = false,
}: {
  id: string;
  placeholder: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type: string;
  errored?: boolean;
}) {
  return (
    <input
      name={id}
      id={id}
      type={type}
      className={
        "block w-full rounded-md border-1 py-1.5 pl-2 ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-0 focus-visible:ring-0 " +
        (errored ? " ring-red-500" : "")
      }
      placeholder={placeholder}
      onChange={onChange}
    />
  );
}

function FeedbackMessage({ errored, children }: {errored:boolean, children: React.ReactNode }) {
  
  let className = "w-10/12 text-xs px-1 pt-[2px] text-neutral-400";
  if (errored) {
    className = "w-10/12 text-xs px-1 pt-[2px] text-red-400"
  }
  return  ( 
    <div className={className}>
      {children}
    </div>
    )

}

export function PasswordlessSiginField({
  placeholder,
}: {
  placeholder: string;
}) {
  const [email, setEmail] = useState<string>("");
  const [sent, setSent] = useState<boolean>(false);
  const [tryAgainTimer, setTryAgainTimer] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [errored, setErrored] = useState<boolean>(false);

  const originName = useRef("");
  useEffect(() => {
    originName.current = window.location.origin;
  }, []);

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setSent(false);
  };

  const onSubmit = async () => {
    if (!email) {
      setErrored(true);
      setFeedbackMessage("Please enter an email address.");
      return 
    }   
    setErrored(false);
    setPending(true);
    setFeedbackMessage("")

    const { data, error } = await supabaseClient.client.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: originName.current + "/sign-in/welcome",
      },
    });

    setPending(false);
    
    if (!error) {
      setSent(true);
      setFeedbackMessage("Check your spam folder if you do not see the email. ");
    } else {

      setErrored(true);
      setFeedbackMessage(error.message);
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center px-2">
      <div className="flex flex-row w-full justify-between">
        <MyStyledInput
          type="text"
          id={"email"}
          placeholder={placeholder}
          onChange={onEmailChange}
          errored={errored}
        />
        <button
          className="ml-2 px-2 py-2 ring-indigo-600  text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-1 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-slate-500 disabled:hover:bg-slate-500"
          onClick={onSubmit}
          disabled={sent || pending}
        >
          <div className="w-8 flex flex-col items-center">
            {pending ? (
              <Spinner speed="1s" className=" h-4 w-4" />
            ) : sent ? (
              "Sent!"
            ) : (
              "Send"
            )}
          </div>
        </button>
      </div>
      <div className='w-full'>
        <FeedbackMessage errored={errored}>{feedbackMessage}</FeedbackMessage>
        </div>
    

    </div>
  );
}
