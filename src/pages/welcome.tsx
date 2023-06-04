import { supabaseClient } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect } from "react";
import { ConfirmInChrome } from "@/components/authMatters/ConfirmInChrome";

import { useState } from "react";
import { Dialog } from "@headlessui/react";

function checkIfChrome(setIsOpen: Dispatch<SetStateAction<boolean>>) {
  return setInterval(() => {
    const extensionTag = document.querySelector(
      'meta[name="review-express-extension"]'
    );
    if (extensionTag) {
      setIsOpen(true);
    }

  }, 100);
}

export default function Page() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // useEffect(() => {
  //   if (window.parent!=window) {
  //     setIsOpen(true)
  //   } else{
  //     router.push("/article")
  //   }

  // }, [])

  useEffect(() => {
    // if it's in extension, there is a meta tag with name="review-express-extension"
    const job = checkIfChrome(setIsOpen);
    return () => clearInterval(job);
  }, []);

  const submitCredentials = () => {
    supabaseClient.client.auth.getSession().then(({ data, error }) => {
      window.postMessage({ message: "signin", payload: { data, error } }, "*");
    });
  };

  return (
    <div>
      <div className="absolute top-1/2">
        Welcome! If you are from the web:{" "}
        <Link href="/article">
          <span className="text-blue-700 underline hover:cursor-pointer">
            click here
          </span>
        </Link>
        <br />
        <br />
        If you are from the extension, close the pop up and open it again.
      </div>
      <ConfirmInChrome
        isOpen={isOpen}
        onAccept={submitCredentials}
        onCancel={() => {
          supabaseClient.signout();
          router.push("/");
        }}
      />
    </div>
  );
}
