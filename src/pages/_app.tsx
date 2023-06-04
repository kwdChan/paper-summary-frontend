import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { createContext, useContext, useState } from "react";

import { NavIcon, NavIconContext } from "@/components/navIcon";

export default function App({ Component, pageProps }: AppProps) {
  const [deleteMode, setDeleteMode] = useState(false);

  return (
    <NavIconContext.Provider value={{ deleteMode, setDeleteMode }}>
      {" "}
      <Component {...pageProps} />{" "}
    </NavIconContext.Provider>
  );
}
