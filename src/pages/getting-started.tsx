import { WarningBox } from "@/components/MessageBox";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { TopBar } from "@/components/theme/TopBar";
import { NavIcon } from "@/components/navIcon";
import { MyInputField } from "@/components/authMatters/MyInputField";
import { PasswordlessSiginField } from "@/components/authMatters/OneLineEmailRegister";
import { Divider } from "@/components/authMatters/Divider";
import { SigninWithGoogleButton } from "@/components/authMatters/SigninWithGoogle";

function Title({ children }: { children: React.ReactNode }) {
  return <h1 className="text-lg font-semibold mx-4 mt-5 mb-4">{children}</h1>;
}
function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="mx-5 text-sm my-2">{children}</p>;
}

export default function Page() {
  const router = useRouter();
  const { errorMessage, errorTitle } = router.query;

  return (
    <>
      <TopBar>
        <TopBar.Title>Getting started</TopBar.Title>
      </TopBar>

      <Title> After Installation </Title>
      <Paragraph>
        You will need an account to use this service. Simply put in your email
        address and we will send you a login link. 
        Password is not required. 
      </Paragraph>

      <div className="flex flex-col m-6 items-center ">
        <PasswordlessSiginField placeholder="Email address" />
        <div className="my-2"></div>
        <Divider />

        <SigninWithGoogleButton />
      </div>

      <div className="m-5"></div>

      <Title>How to use</Title>
      <Paragraph>1. Highlight the text you want to summarise.</Paragraph>
      <Paragraph>
        {"2. Activate the extension by right clicking and selecting 'Summarise'."}
      </Paragraph>
      <Paragraph>
        3. A popup will appear and you can select how you would like the selected to be summarised.
      </Paragraph>


      <div  className="flex flex-col items-center mt-5">     
        <video autoPlay muted loop>
          <source src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" type="video/mp4"/>
          Your browser does not support HTML5 video.
        </video>
      </div>

      <div className="m-5"></div>

      <Paragraph>Note that the page may need to be reloaded, if it is opened before this extension is installed.</Paragraph>

      <Paragraph>You can set up a keyboard shortcut in chrome://extensions/shortcuts to trigger this action. </Paragraph>

      <div className="m-5"></div>

      <Title>Troubleshoot</Title>
      <Paragraph>1. I don&apos;t see the popup: 1. fullscreen 2. opened in another desktop</Paragraph>

      <Paragraph>2. openai</Paragraph>

      <Title>Feedbacks</Title>
      <Paragraph>
        If you have any suggestions, feature request and debug report, please contact me on {" "}
        <a href="mailto:kwdaniel2020@gmail.com" className="text-blue-500 underline" >kwdaniel2020@gmail.com</a>
        </Paragraph>
      <WarningBox title={String(errorTitle || "")}>
        {String(errorMessage || "")}
      </WarningBox>
    </>
  );
}
