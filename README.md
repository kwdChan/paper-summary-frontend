# <img src="public/icon_48.png" width="45" align="left"> Review Express 

> AI-powered summarisation tool for scientific papers and web pages - built for researchers who need to read faster and understand deeper.

![Chrome Extension](https://img.shields.io/badge/Platform-Chrome%20Extension-4285F4?logo=googlechrome&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-React-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?logo=supabase&logoColor=white)
![Status](https://img.shields.io/badge/Status-Inactive-lightgrey)

---

## Background

When ChatGPT launched, I was in the middle of my PhD and immediately tried using it to speed up my research reading. Pasting a full article and asking for a summary produced generic output that missed what I actually needed - yet the model was clearly capable of extracting exactly the right information when given precise instructions.

Two problems were clear: the model didn't know what to extract, and feeding it too much text caused it to lose focus and reference irrelevant content.

These insights shaped Review Express. Highlight only the relevant passage, then tell the model exactly what to extract. The summary modes exist because "summarise this" is rarely the right instruction.

The project was published on the [Chrome Web Store](https://chromewebstore.google.com/detail/review-express/bdmdngoamjhncjgclcfppjjgfihdgbfp) before being deprecated. The codebase remains here as a portfolio piece.


---

## Features

- **Highlight-to-summarise** - select any text on a page and summarise only that portion
- **Summary modes** - multiple modes for different reading goals:
  - *One Sentence* - single-line TL;DR
  - *Main Points* - structured overview of key content
  - *Listed Details* - detailed breakdown in list form
  - *Simplify It* - plain language rewrite
  - *Argument & Counter-arguments* - central argument and opposing views
  - *Journal Articles: Abstract Simplified* - abstract in plain language
  - *Journal Articles: New Findings* - key results and discoveries
  - *Journal Articles: Background* - context and motivation behind the research
  - *Journal Articles: New Ideas & Opinions* - novel perspectives and implications
- **Q&A mode** - ask free-form questions and get answers grounded strictly in the selected text
- **Summary history** - revisit past selections and their summaries without re-reading
- **Caching** - if the same text and mode combination has been used before, the cached result is returned instantly rather than making a new API call, saving tokens and improving response time. Users can optionally force a refresh.
- **Works on scientific papers and general web pages**
- **Passwordless & password auth** - flexible sign-in options via Supabase
---

## Architecture

This project is split across three repositories reflecting its multi-service architecture:

| Repo | Purpose | Stack |
|------|---------|-------|
| [`paper-summary-chrome`](https://github.com/kwdChan/paper-summary-chrome/) | Chrome extension | TypeScript, Webpack, Chrome Extensions API |
| [`paper-summary-frontend`](.) | Web UI (this repo) | TypeScript, Next.js on Vercel |
| [`paper-summary-functions`](https://github.com/kwdChan/paper-summary-functions) | Serverless API & prompt logic | Supabase Edge Functions, SQL Functions|

> The Chrome extension retrieves the login session from the web UI and sends the selected text to the backend via API calls. The web UI and backend then handle the rest - receiving the summarisation requests from the users, making the OpenAI API calls and displaying the result. 


---

## Tech Stack

| Component | Technology |
|-------|-----------|
| Extension | TypeScript, Webpack, Chrome Extensions API (Manifest V3) |
| Frontend | TypeScript, Next.js on Vercel |
| Backend | Supabase (PostgreSQL, Edge Functions) |
| Auth | Supabase Auth - passwordless & password-based |
| AI | OpenAI GPT API |
| Prompt Engineering | Custom-designed system prompts per summary mode |
---


## How It Works

1. The user highlights text on any web page or journal article
2. The extension is triggered via a right-click context menu entry or a keyboard shortcut, which opens a popup window
3. If not already logged in, the user authenticates via the extension's web UI. The session is saved locally so subsequent uses require no re-login
4. The selected text is sent to the backend via an API call
5. On the popup window that shows the web UI, the user selects a summary mode or switches to Q&A mode
6. A Supabase edge function checks whether this exact text + mode combination has been requested before
   - **Cache hit** - the stored result is returned instantly
   - **Cache miss** - an OpenAI API call is made
7. The result is streamed to the web UI and saved to the user's history
8. In Q&A mode, the user types a free-form question and receives an answer grounded in the selected text
9. Users can optionally force a refresh on any cached summary to generate a new response

---

## Prompt Engineering

Rather than using a generic "summarise this" instruction, each summary mode has its own purpose-built system prompt tailored to a specific reading goal. Key considerations included:

- **Scoped context** - only the selected text is passed to the API, keeping responses focused and token-efficient
- **Q&A grounding** - Q&A prompts constrain the model to answer only from the provided text, reducing hallucination

Prompts are managed server-side in Supabase Edge Functions - a serverless environment that eliminates the need to host and maintain a dedicated server

---

## Reflections

Looking back, there are a few things I'd approach differently

1. **Additional complexity from the use of React** - I decided to use React because it seemed simpler than vanilla JS. But then I realised it's hard to get React working without a frontend server without exotic bundling configuration. If I had stuck with vanilla JS, the UI could have just been rendered by the extension itself without the need of the additional frontend server. 

2. **Caching was over-engineered** - It was a cool idea but the token savings were minimal in practice. The implementation took considerable time and the added complexity slowed down the further development.

3. **The security side of things** - Having an additional frontend server seemed manageable until I decided to have a login system. I had to pass the login session from the web UI to the extension so the extension could send the selected text to the correct user. It took me significant time to figure out if it was even feasible. Although I found a solution that was secure in principle, this was still an additional complexity (thus security risk) that could have been unnecessary had I stuck with vanilla JS. 

4. **Prioritising speed over structure** - I was very passionate about this project and wanted to see results quickly, so I kept delaying refactoring at every milestone. Once the extension was live on the Chrome Web Store, I realised it was very hard to reverse the major architectural decisions. It was as if I had to start the project over. If I were to build this again, I'd invest more in the architecture upfront, even at the cost of slower initial progress.


There are also things that worked well
1. **Typescript** - While it took me longer to learn and write, it caught a lot of bugs in edge cases so it ended up accelerating the development and freed up a lot of mental energy.   

2. **Supabase with Serverless Functions** — offloading auth, database, and backend logic meant no server to monitor or maintain. This has been perfect for a solo hobby project with limited time.

3. **Learning everything from scratch** - this project pushed me across a wide surface area: JWT, auth, databases, TypeScript in multiple runtimes (browser, Chrome extension, Deno), React, and serverless edge functions. The breadth of what I had to figure out independently was challenging, but it's where most of the learning happened.

---
