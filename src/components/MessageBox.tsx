import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import React from "react";

export function Error({ children }:{children:string}) {
    const [up, setUp] = React.useState<boolean>(true);
  
    return (
    <>
      {up ? (
      <div className ='flex flex-row  absolute bottom-1 left-1 ring-1 rounded-sm  ring-yellow-600 bg-orange-100 text-yellow-700 '>
        <div className="flex flex-row items-center  p-2">
          <ExclamationCircleIcon className="h-5 w-5 mr-2 " />
          <p className="max-w-screen-md"> {children}</p>
        </div>
        <div className="h-5 w-5 m-[0.1rem] hover:cursor-pointer" onClick={()=>{setUp(false)}} >
          <XMarkIcon />
        </div>
      </div>
      ) : null
    }</>)
  }
  