import React from 'react';
import type { AppProps } from 'next/app';
import "tailwindcss/tailwind.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Component {...pageProps} />
      <style jsx global>{`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        @layer base {
          html,
          body {
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
              Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
          }
  
          * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
          }
  
          a {
            color: inherit;
            text-decoration: none;
          }

          @media (prefers-color-scheme: dark) {
            html {
              color-scheme: dark;
            }
            body {
              color: white;
              background: black;
            }
          }
        }
      `}</style>
    </React.Fragment>
  );
}

export default MyApp;
