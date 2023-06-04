import { Fragment } from "react";
import React from "react";


export function textWithLineBreak(text: string, className: string) {
  return (
    <Fragment>
      {text.split("\n").map((line, idx) => (
        <p className={className} key={idx}>
          {line}
          <br />
        </p>
      ))}
    </Fragment>
  );
}
