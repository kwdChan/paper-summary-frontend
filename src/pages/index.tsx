import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const DOWNLOAD_URL: string = process.env.NEXT_PUBLIC_DOWNLOAD_URL || "";
export default function IndexPage({}) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
            <Head>
      <meta name="google-site-verification" content="SzbW5eNxXEGPWiBSBivdfE8A85OX2sM68zKRkYuv9Xg" />
      </Head>
      <div className=" hover:cursor-pointer inline-flex items-center m-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <Link 
                href={DOWNLOAD_URL}
      >
        <a target="_blank" rel="noopener noreferrer">Download</a>
        
      </Link></div>
      <button
        className="
      inline-flex items-center m-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => router.push("/signin")}
      >
        Sign in
      </button>{" "}
    </div>
  );
}
