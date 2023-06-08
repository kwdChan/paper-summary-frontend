import { useRouter } from "next/router";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";

export const H1 = ({...props }) => (
  <h1 className="text-2xl font-bold mt-9 mb-3 mx-5" {...props} />
);
export const H2 = ({...props }) => (
  <h2 className="text-xl font-bold mt-9 mb-3  mx-5" {...props}/>
);
export const Link= ( {...props} ) => (
  <a className="text-blue-500 hover:underline"  {...props}/>
);
export const P= ( {...props} ) => (
  <p className="my-3 mx-5" {...props} />
);

export const UL = ({ ...props }) => (
  <ul className="list-disc list-outside my-3 mx-10" {...props} />
)

export const LI = ({ ...props }) => (
  <li className="my-3 " {...props} />
)


export default function MarkdownRender({children}: {children: string}) {
  return (
    <>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={
        { 
          h1: H1,
          h2: H2,
          a: Link,
          p:P, 
          ul:UL,
          li:LI,
        }}
        >
        {children}
      </ReactMarkdown>
    </>
  );
}
