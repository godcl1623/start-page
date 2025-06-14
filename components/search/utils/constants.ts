import { SearchEnginesData } from "controllers/searchEngines";

export const SEARCH_ADDRESS_BY_ENGINE: SearchEnginesData[] = [
    {
        id: `engine_data_google`,
        name: "Google",
        url: "https://www.google.com/search?q=",
    },
    {
        id: `engine_data_naver`,
        name: "Naver",
        url: "https://search.naver.com/search.naver?query=",
    },
    {
        id: `engine_data_daum`,
        name: "Daum",
        url: "https://search.daum.net/search?q=",
    },
];
