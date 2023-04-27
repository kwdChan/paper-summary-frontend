import Link from "next/link";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  return (
    <div>
      <div className="absolute top-1/2">
        Welcome! If you are from the web:{" "}
        <Link href="/article" ><span className="text-blue-700 underline hover:cursor-pointer">click here</span></Link>
        <br /><br />
        If you are from the extension, close the pop up and open it again.
      </div>
    </div>
  );
}
