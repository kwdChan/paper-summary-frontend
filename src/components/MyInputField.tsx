import React, { useState } from "react";
import { EyeIcon } from "@heroicons/react/20/solid";
import { EyeSlashIcon } from "@heroicons/react/20/solid";

function MyStyledInput({
  id, onChange, placeholder, type, errored = false
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
      className={"block w-full rounded-md border-1 py-1.5 pl-2 pr-2 ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-0 focus-visible:ring-0 " + (errored ? " ring-red-500" : "")}
      placeholder={placeholder}
      onChange={onChange} />
  );
}
export function MyInputField({
  id, label, onChange, placeholder, errored = false,

}: {
  id: string;
  label: string;
  placeholder: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  errored?: boolean;

}) {

  return (
    <div className="relative rounded-md shadow-sm ">
      <label className="" htmlFor={id}>{label}</label>
      <div className="relative rounded-md shadow-sm">
        <MyStyledInput type="text" id={id} placeholder={placeholder} onChange={onChange} errored={errored} />

      </div>
    </div>
  );
}
export function MyPasswordField({
  id, label, onChange, placeholder, errored = false,
}: {
  id: string;
  label: string;
  placeholder: string;
  errored?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  const [passwordVisble, setPasswordVisble] = useState<boolean>(false);
  return (
    <div className="relative mt-5  rounded-md shadow-sm">
      <label htmlFor={id} className="">{label}</label>
      <div className="relative rounded-md shadow-sm">
        <MyStyledInput type={passwordVisble ? 'text' : 'password'} id={id} placeholder={placeholder} onChange={onChange} errored={errored} />

        <button
          className="absolute inset-y-0 right-3 flex items-center"
          onClick={() => setPasswordVisble(!passwordVisble)}
        >
          {!passwordVisble ? <EyeIcon className="h-4 text-gray-400 hover:text-gray-600" /> : <EyeSlashIcon className="h-4 text-gray-400 hover:text-gray-600" />}
        </button>
      </div>
    </div>
  );
}
