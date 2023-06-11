import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import React from "react";
import { useRouter } from "next/router";

export function WarningBox({
  title,
  children,
}: {
  title: string | null;
  children: string | undefined | null;
}) {
  const [up, setUp] = React.useState<boolean>(true);

  return (
    <>
      {up && (children || title) ? (
        <div className="flex flex-row fixed top-1 left-1 mr-1 ring-1 rounded-sm  ring-yellow-600 bg-orange-100 text-yellow-700 ">
          <div className="flex flex-row items-center p-2">
            <ExclamationCircleIcon className="h-6 w-6 min-w-fit mr-2 " />
            <div>
              <h1 className="text-lg font-semibold">{title}</h1>
              <p className=""> {children}</p>
            </div>
          </div>
          <div
            className=" m-[0.1rem]  hover:cursor-pointer "
            onClick={() => {
              setUp(false);
            }}
          >
            <XMarkIcon className=" h-5 w-5 min-w-fit hover:text-amber-900 hover:shadow-2xl hover:shadow-orange-500" />
          </div>
        </div>
      ) : null}
    </>
  );
}

WarningBox.Renderred = function WarningBoxRenderred() {
  const router = useRouter();
  const { errorMessage, errorTitle } = router.query;
  return (
    <WarningBox title={String(errorTitle || "")}>
      {String(errorMessage || "")}
    </WarningBox>
  );
};
