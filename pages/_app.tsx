import React from "react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Seo from "components/Seo";
import "tailwindcss/tailwind.css";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 4,
        },
    },
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <React.Fragment>
            <Seo title="Start Page" />
            <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />
            </QueryClientProvider>
            <style jsx global>{`
                @tailwind base;
                @tailwind components;
                @tailwind utilities;

                @layer base {
                    html,
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, Segoe UI,
                            Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans,
                            Droid Sans, Helvetica Neue, sans-serif;
                    }

                    html,
                    body,
                    div#__next {
                        width: 100%;
                        height: 100%;
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

                @layer utilities {
                    .flex-center {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
            `}</style>
        </React.Fragment>
    );
}

export default MyApp;
