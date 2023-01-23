import Router from "next/router";
import RequestControllers from "controllers";
import { URLS_RULE } from "./constants";

const { postDataTo } = new RequestControllers();

export const extractInputValue = (element: Element) => {
    if (element instanceof HTMLInputElement) return element.value;
    return;
};

export const checkIfStringPassesRule = (
    target: string | undefined,
    rule = URLS_RULE
) => {
    if (target) return rule.test(target);
    return;
};

export const refreshPage = (flag: boolean) => {
    const condition = flag;

    if (condition) {
        alert("저장되었습니다.");
        Router.reload();
    }
};
