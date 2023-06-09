import { supabaseClient } from "@/lib/supabaseClient";
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
        "block w-full  rounded-md border-1 py-1.5 pl-2 ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-0 focus-visible:ring-0 " +
        (errored ? " ring-red-500" : "")
      }
      placeholder={placeholder}
      onChange={onChange}
    />
  );
}

export function OneLineInputField({ placeholder }: { placeholder: string }) {
  const [email, setEmail] = useState<string>('');
  const originName = useRef('')
  useEffect(() => {
    originName.current = window.location.origin;
    }, []);


  const onSubmit = async () => {
    const { data, error } = await supabaseClient.client.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: originName.current+'/sign-in/welcome'
      }
    })
  }


  return (
    <div className="flex flex-row w-full justify-between">
      <MyStyledInput
        type="text"
        id={"email"}
        placeholder={placeholder}
        onChange={(e)=>setEmail(e.target.value)}
        errored={false}
      />
      <button 
      className="ml-2 px-2 py-2 ring-indigo-600  text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-1 focus:ring-indigo-500 focus:ring-offset-2"
      onClick={onSubmit}
      >
        Send
      </button>
    </div>
  );
}
