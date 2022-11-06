import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { promises as fs } from 'fs';
import { handlePOSTRequest, handlePATCHRequest } from 'controllers/feed';
import { areEqual } from 'common/capsuledConditions';

interface FeedData {
  originLink: string;
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const jsonDirectory = path.join(process.cwd(), 'model');
  const fileContents = await fs.readFile(`${jsonDirectory}/feeds.json`, 'utf8');
  if (areEqual(request.method, 'GET')) {
    response.status(200).json(fileContents);
  } else if (areEqual(request.method, 'POST')) {
    const result = handlePOSTRequest(request, fileContents);
    if (result) {
      const newData = {
        data: result,
      };
      fs.writeFile(`${jsonDirectory}/feeds.json`, JSON.stringify(newData));
      response.status(200).json(newData);
    }
  } else if (areEqual(request.method, 'PATCH')) {
    const result = handlePATCHRequest(request, fileContents);
    if (result) {
      const newData = {
        data: result,
      };
      fs.writeFile(`${jsonDirectory}/feeds.json`, JSON.stringify(newData));
      response.status(200).json('success');
    } else if (areEqual(result, null)) {
      response.status(404).json('Not Found');
    } else if (areEqual(result, false)) {
      response.status(400).json('Unknown data has passed.');
    } else {
      response.status(500).json('Unhandled Error has occured');
    }
  } else if (areEqual(request.method, 'DELETE')) {
    const feedsToDelete = request.body;
    const originalFeeds = JSON.parse(fileContents).data;
    const filteredList = originalFeeds.filter((feedData: FeedData) => {
      const urlToDeleteInCurrentLoop = feedsToDelete.find((url: string) =>
        feedData.originLink.includes(url)
      );
      const indexOfUrlToDelete = feedsToDelete.indexOf(urlToDeleteInCurrentLoop);
      if (indexOfUrlToDelete < 0) return feedData;
      return;
    });
    const newData = {
      data: filteredList,
    };
    console.log(filteredList)
    fs.writeFile(`${jsonDirectory}/feeds.json`, JSON.stringify(newData));
    response.status(200).json('success');
  }
}
