import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { createContext, useContext, useState } from "react";

import { NavIcon, NavIconContext } from "@/components/navIcon";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  const [deleteMode, setDeleteMode] = useState(false);

  return (
    <>
      <Head>
        <link
          rel="icon"
          href="/icon.svg"
          type="image/svg"
          sizes="<generated>"
        />
      </Head>
      <NavIconContext.Provider value={{ deleteMode, setDeleteMode }}>
        {" "}
        <Component {...pageProps} />{" "}
      </NavIconContext.Provider>
    </>
  );
}
