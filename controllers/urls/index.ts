import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';
import { promises as fs } from 'fs';

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

export const handlePOSTRequest = async ({
  request,
  response,
  stringifiedFile,
  fileDirectory,
}: HandlerArguments) => {
  const { mode, url } = request.body;
  if (mode === 'test') {
    const validationResult = await checkIfUrlValid(url);
    sendValidationResult(response, validationResult);
  } else if (mode === 'post') {
    const { urls } = JSON.parse(stringifiedFile);
    console.log(urls)
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
