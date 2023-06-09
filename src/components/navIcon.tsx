import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState, createContext, useContext } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Highlight } from "@/lib/types";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/router";



function MenuItem({text, href, onClick=()=>{}}:
  { text:string, href:string, onClick?:()=>void}){
    const router = useRouter();

  return (

    <Menu.Item>
      {({ active }) => (
        <button
          className={`${
            active ? "bg-violet-500 text-white" : "text-gray-900"
          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
          onClick={()=>{onClick(); router.push(href)}}
        >
          {text}
        </button>
      )}
    </Menu.Item>
  );
}

function MenuEntrance() {
  return (
    <Menu.Button className="inline-flex w-full justify-center rounded-full bg-black bg-opacity-20 px-2 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
      <ChevronDownIcon
        className="h-6 w-6 text-violet-200 hover:text-violet-100"
        aria-hidden="true"
      />
    </Menu.Button>
  );
}


export function NavIcon({}) {
  const router = useRouter();
  console.log("router.query", router.route)

  const { deleteMode, setDeleteMode } = useContext(NavIconContext);

  const deleteModeToggle = () => {
    setDeleteMode(!deleteMode);
  }

  return (
    <div className="absolute top-2 right-2 text-right z-50">

      <Menu as="div" className="relative inline-block text-left">
        <MenuEntrance />

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1"><MenuItem text='My Usage' href='/dashboard' /></div>
            
            <div className="px-1 py-1 ">

            

            <MenuItem text='All Articles' href='/article' />
            {(router.route=='/article') && <MenuItem text='Delete Mode' href='' onClick={deleteModeToggle} />}
            </div>

            <div className="px-1 py-1">
            <MenuItem text='Signout' href='/sign-in/passwordless' onClick={()=>supabaseClient.signout().then(res=>console.log(res))} />
            
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}



export interface NavIconContextData {
  deleteMode: boolean;
  setDeleteMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NavIconContext = createContext<NavIconContextData>({
  deleteMode: false,
  setDeleteMode: () => {},
});

