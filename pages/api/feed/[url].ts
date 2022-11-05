import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { promises as fs, writeFileSync } from 'fs';
import { areEqual } from 'common/capsuledConditions';

interface FeedData {
  id: number;
  originName: string;
  originLink: string;
  lastFeedsLength: number;
  latestFeedTitle: string;
  feeds: string[];
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const jsonDirectory = path.join(process.cwd(), 'model');
  const fileContents = await fs.readFile(`${jsonDirectory}/feeds.json`, 'utf8');
  if (areEqual(request.method, 'DELETE')) {
    const urlToDelete =
      typeof request.query.url === 'string' ? request.query.url.replaceAll('_', '.') : '';
    const parsedContents = JSON.parse(fileContents);
    if (parsedContents && parsedContents.data.length > 0) {
      console.log(parsedContents.data.length)
      const filteredList = parsedContents.data.filter((feedData: FeedData) => !feedData.originLink.includes(urlToDelete));
      const newList = {
        data: filteredList,
      };
      writeFileSync(`${jsonDirectory}/feeds.json`, JSON.stringify(newList));
      console.log(newList)
      response.status(200).json('success');
    } else {
      response.status(404).json('Cannot find feeds.');
    }
  } else {
    response.status(500).json('Api unavailable');
  }
}
