import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';
import { promises as fs } from 'fs';
import { areEqual } from 'common/capsuledConditions';

interface HandlerArguments {
  request: NextApiRequest;
  response: NextApiResponse;
  stringifiedFile: string;
  fileDirectory: string;
}

interface WriteFunctionArguments {
  response: NextApiResponse;
  flag: boolean;
  urlsArray: string[];
  url: string;
  fileDirectory: string;
}

interface SubscriptionData {
  url: string;
  unsubscribe: boolean;
  deleteFeeds: boolean;
}

export const handlePOSTRequest = async ({
  request,
  response,
  stringifiedFile,
  fileDirectory,
}: HandlerArguments) => {
  const { mode, url } = request.body;
  if (areEqual(mode, 'test')) {
    const validationResult = await checkIfUrlValid(url);
    sendValidationResult(response, validationResult);
  } else if (areEqual(mode, 'post')) {
    const { urls } = JSON.parse(stringifiedFile);
    const overlapCheckResult = checkIfUrlOverlapped(urls, url);
    writeNewUrlToFile({ response, flag: overlapCheckResult, fileDirectory, urlsArray: urls, url });
  }
};

const checkIfUrlValid = async (url: string) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error);
    }
  }

  return;
};

const sendValidationResult = (response: NextApiResponse, data: string) => {
  if (data.includes('xml')) {
    response.status(200).json(true);
  } else {
    response.status(404).json(false);
  }
};

const checkIfUrlOverlapped = (urls: string[], url: string) => {
  return urls.includes(url);
};

const writeNewUrlToFile = ({
  response,
  flag,
  urlsArray,
  url,
  fileDirectory,
}: WriteFunctionArguments) => {
  const condition = flag;
  if (condition) {
    response.status(502).json({
      reason: 'Url already exists.',
    });
  } else {
    const urlsWithNewUrl = [...urlsArray, url];
    const body = {
      urls: urlsWithNewUrl,
    };
    fs.writeFile(`${fileDirectory}/urls.json`, JSON.stringify(body));
    response.status(200).json(true);
  }
};

export const handlePATCHRequest = async ({
  request,
  response,
  stringifiedFile,
  fileDirectory,
}: HandlerArguments) => {
  // const urlsToDelete = request.body;
  // if (urlsToDelete.length > 0) {
  //   const { urls } = JSON.parse(stringifiedFile);
  //   const filteredList = urls.filter((url: string) => !urlsToDelete.includes(url));
  //   const newList = {
  //     urls: filteredList,
  //   };
  //   // fs.writeFile(`${fileDirectory}/urls.json`, JSON.stringify(newList));
  //   response.status(200).json(true);
  // }
  const subscriptionList = request.body;
  const unsubscribeList = subscriptionList.filter(
    (subscriptionData: SubscriptionData) => subscriptionData.unsubscribe
  );
  const deleteFeedsList = subscriptionList.filter(
    (subsciriptionData: SubscriptionData) => subsciriptionData.deleteFeeds
  );
  /* 쓰기 기능만 활성화하면 완료 */
  if (unsubscribeList.length > 0) {
    const { urls } = JSON.parse(stringifiedFile);
    const filteredList = urls.filter(
      (url: string) =>
        !unsubscribeList.map((listData: SubscriptionData) => listData.url).includes(url)
    );
    // const newList = {
    //   urls: filteredList,
    // };
    // fs.writeFile(`${fileDirectory}/urls.json`, JSON.stringify(newList));
  }
  /* delete로 구현이 불가능하면 patch로 바꿀 것 */
  if (deleteFeedsList.length > 0) {
    deleteFeedsList.forEach((listData: SubscriptionData) => {
      setTimeout(() => {
        axios.delete(
          `http://localhost:3000/api/feed/${listData.url.split('/')[2].replaceAll('.', '_')}`
        );
      }, 100);
    });
    // const result = await Promise.all(deleteRequests);
    // for (const listData of deleteFeedsList) {
    //   axios.delete(`http://localhost:3000/api/feed/${listData.url.split('/')[2].replaceAll('.', '_')}`);
    // }
    // console.log('result: ', result);
  }
  return false;
};
