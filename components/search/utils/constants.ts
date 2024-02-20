import { SearchEnginesData } from "controllers/searchEngines";
import { nanoid } from 'nanoid';

export const SEARCH_ADDRESS_BY_ENGINE: SearchEnginesData[] = [
    {
        id: `engine_data_${nanoid()}`,
        name: "Google",
        url: "https://www.google.com/search?q=",
    },
    {
        id: `engine_data_${nanoid()}`,
        name: "Naver",
        url: "https://search.naver.com/search.naver?query=",
    },
    {
        id: `engine_data_${nanoid()}`,
        name: "Daum",
        url: "https://search.daum.net/search?q=",
    },
];
