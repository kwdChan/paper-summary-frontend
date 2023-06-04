import { WarningBox } from "@/components/MessageBox";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const { error: errorQuery } = router.query;


  return (
  <>
    hello
    <WarningBox>{typeof(errorQuery)==='string'? errorQuery: null}</WarningBox>

  </>)
}
