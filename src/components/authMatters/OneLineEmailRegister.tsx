import React, { useState } from "react";

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
export function OneLineInputField({
  placeholder,
}: {
  placeholder: string;
}) {
  const [errored, setErrored] = useState(false);
  const onChange = () => {};

  return (
    <div className="flex flex-row w-full sm:w-96" >
      <MyStyledInput
        type="text"
        id={"email"}
        placeholder={placeholder}
        onChange={onChange}
        errored={errored}
      />
      <button className="inline-flex items-center mx-2 px-2 py-2 ring-indigo-600  text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-1 focus:ring-indigo-500 focus:ring-offset-2">
        Send
      </button>
    </div>
  );
}
