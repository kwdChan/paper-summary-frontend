import { WarningBox } from "@/components/MessageBox";
import { useRouter } from "next/router";
import { useEffect } from "react";


export default function Page() {
  const router = useRouter();
  const { errorMessage, errorTitle } = router.query;


  return (
  <>
    hello
    <WarningBox title={String(errorTitle||'')}>{String(errorMessage||'')}</WarningBox>

  </>)
}
