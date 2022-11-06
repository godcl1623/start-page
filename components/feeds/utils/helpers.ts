import axios, { AxiosError } from 'axios';
import Router from 'next/router';
import { URLS_RULE } from './constants';

export const extractInputValue = (element: Element) => {
  if (element instanceof HTMLInputElement) return element.value;
  return;
};

export const checkIfStringPassesRule = (target: string | undefined, rule = URLS_RULE) => {
  if (target) return rule.test(target);
  return;
};

export const checkIfFeedOriginValid = async (flag: boolean, url: string) => {
  const condition = flag;

  if (condition) {
    try {
      const body = {
        mode: 'test',
        url,
      };

      const { data } = await axios.post('/api/urls', body);
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        alert('올바르지 않은 피드 주소입니다.')
      } else if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  return false;
};

export const postNewFeedOrigin = async (flag: boolean, url: string) => {
  const condition = flag;

  if (condition) {
    try {
      const body = {
        mode: 'post',
        url,
      };
      const { data } = await axios.post('api/urls', body);
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 502) {
        alert('이미 존재하는 주소입니다.');
      } else if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  return false;
};

export const refreshPage = (flag: boolean) => {
  const condition = flag;

  if (condition) {
    alert('저장되었습니다.')
    Router.reload();
  }
};
