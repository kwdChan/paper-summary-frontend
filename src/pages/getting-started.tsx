import { WarningBox } from "@/components/MessageBox";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/theme/TopBar";
import { NavIcon } from "@/components/navIcon";
import { MyInputField } from "@/components/authMatters/MyInputField";
import { PasswordlessSiginField } from "@/components/authMatters/OneLineEmailRegister";
import { Divider } from "@/components/authMatters/Divider";
import { SigninWithGoogleButton } from "@/components/authMatters/SigninWithGoogle";
import { supabaseClient } from "@/lib/supabaseClient";
import MarkdownRender from "@/components/theme/Markdowns";
import PrivacyPolicyLink from "@/components/theme/PrivacyPolicyLink";

function Title({
  id = "",
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <h1 id={id || undefined} className="text-2xl font-semibold mx-4 mt-5 mb-4">
      {children}
    </h1>
  );
}

function Subtitle({
  id = "",
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <h2 id={id || undefined} className="text-lg mx-4 mt-5 mb-4 font-bold">
      {children}
    </h2>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="mx-5 text-base my-2">{children}</p>;
}

function AlreadySignedIn() {
  const router = useRouter();
  return (
    <div
      className="hover:ring-2 hover:cursor-pointer flex flex-col items-center ring-1 mt-4 text-blue-800 ring-slate-300 rounded-sm bg-blue-50 p-2 w-10/12 max-w-xs mx-auto"
      role="button"
      onClick={() => {
        router.push("/article");
      }}
    >
      You are signed in!
    </div>
  );
}

function SigninSignupField() {
  return (
    <div className="flex flex-col my-6 items-center  mx-2">
      <PasswordlessSiginField placeholder="Email address" />
      <div className="my-2"></div>

      <div className="w-full max-w-md"><Divider /></div>
      

      <SigninWithGoogleButton />
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const { errorMessage, errorTitle } = router.query;
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabaseClient.refreshSession().then(({ data, error }) => {
      if (!error && data.user) {
        setSignedIn(true);
      }
    });
  }, []);

  return (
    <div className="overflow-x-clip">
      <TopBar>
        <TopBar.Title>Getting started</TopBar.Title>
      </TopBar>

      <Title> After Installation </Title>
      <Paragraph>
        You will need an account to use this service. Simply put in your email
        address and we will send you a login link. Password is not required.
      </Paragraph>
      <div className="my-8">
        {signedIn ? <AlreadySignedIn /> : <SigninSignupField />}
      </div>
      <Title id="how_to_use">How to use</Title>
      <Paragraph>1. Highlight the text you want to summarise.</Paragraph>
      <Paragraph>
        {
          "2. Activate the extension by right clicking and select 'Summarise the selected'."
        }
      </Paragraph>
      <Paragraph>
        3. A popup will appear and you can select how you would like the
        selected to be summarised.
      </Paragraph>

      <div className="flex flex-col items-center mt-5 bg-clip-content">
        <video autoPlay muted loop className="w-[700px] ring-1 ring-black ">
          <source src="/demo.mp4" type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
      </div>

      <div className="m-5"></div>

      <Paragraph>
        Note that the page may need to be reloaded, if it is opened before this
        extension is installed.
      </Paragraph>

      <Paragraph>
        You can set up a keyboard shortcut to trigger the action by enter this
        link: <b> chrome://extensions/shortcuts</b> to the URL bar.{" "}
      </Paragraph>

      <div className="m-5"></div>

      <Title>Troubleshooting</Title>
      <Subtitle>
        Issue: The popup does not appear upon activation <br />
      </Subtitle>
      <ul className="list-decimal list-outside my-3 mx-10">
        <li className="my-3">
          <b>Turn off the fullscreen mode.</b> The popup appears as a separated
          window so it may be hidden if you are in the fullscreen mode
        </li>
        <li className="my-3">
          <b>See if it is on another virtual desktop</b>. The popup will surface
          at its existing location if unclosed.
        </li>
        <li>
          If none of that works, go to <b> chrome://extensions</b> and reload
          the extension
        </li>
      </ul>
      <Subtitle> Issue: Slow response or the OpenAI Error</Subtitle>
      <ul className="list-disc list-outside my-3 mx-10">
        <li className="my-3">
          If you get the OpenAI Error when the selected text is short, it is
          likely that OpenAI is under heavy load. Please try again later.
        </li>
        <li className="my-3">Contact me if that happens too often.</li>
      </ul>

      <Subtitle> Issue: The text is too small </Subtitle>
      <ul className="list-disc list-outside my-3 mx-10">
        <li className="my-3">
          Try &quot;ctrl-shift-=&quot; or &quot;cmd-shift-=&quot;. You should be
          able to increase the text size like how you do it in a normal webpage.
        </li>
      </ul>

      <Title>Feedbacks</Title>
      <Paragraph>
        If you have any other issues, suggestions or feature requests, feel free
        to contact me on{" "}
        <a
          href="mailto:kwdaniel2020@gmail.com"
          className="text-blue-500 underline"
        >
          kwdaniel2020@gmail.com
        </a>
      </Paragraph>

      <PrivacyPolicyLink />

      <WarningBox title={String(errorTitle || "")}>
        {String(errorMessage || "")}
      </WarningBox>
    </div>
  );
}
