export function TopBar({ children }: { children?: React.ReactNode|undefined }) {
  return (
    <div className="flex items-center justify-between relative bg-blue-500 text-white h-14 w-screen overflow-ellipsis p-1">
        {children}
    </div>
  );
}

TopBar.Title = function TopBarTitle({ children }: { children?: React.ReactNode }) {
    return (
        <div className="w-8/12 px-2 ">
          <b>{children}</b>
        </div>
    );
  }
  