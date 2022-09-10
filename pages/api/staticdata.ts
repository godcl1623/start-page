import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { promises as fs } from 'fs';
import { FeedsObjectType, FeedsSourceType } from 'types/global';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const jsonDirectory = path.join(process.cwd(), 'model');
  const fileContents = await fs.readFile(`${jsonDirectory}/database.json`, 'utf8');
  if (request.method === 'GET') {
    response.status(200).json(fileContents);
  } else if (request.method === 'POST') {
    const { feedsObject, feedsSource } = request.body;
    const numberOfKeysLessThanEight = feedsObject.filter((postedData: FeedsObjectType) => Object.keys(postedData).length < 8).length;
    if (numberOfKeysLessThanEight === 0) {
      const { feeds, origins } = JSON.parse(fileContents);
      let newFeedContents: FeedsObjectType[] = [];
      let feedOverlayFiltered: FeedsObjectType[] = [];
      let newOrigins: FeedsSourceType[] = [];
      let originsOverlayFiltered: FeedsSourceType[] = [];
      if (feeds.length === 0) {
        newFeedContents = feeds.concat(feedsObject);
      } else {
        feedOverlayFiltered = feedsObject.filter((newFeedData: FeedsObjectType) => {
          return !feeds.some((storedFeedData: FeedsObjectType) => storedFeedData.title === newFeedData.title);
        });
        newFeedContents = feeds.concat(feedOverlayFiltered);
      }
      if (origins.length === 0) {
        newOrigins = origins.concat(feedsSource);
      } else {
        originsOverlayFiltered = feedsSource.filter((newOrigins: FeedsSourceType) => {
          return !origins.some((storedOrigins: FeedsSourceType) => storedOrigins.originName === newOrigins.originName);
        });
        newOrigins = origins.concat(originsOverlayFiltered);
      }
      const result = {
        feeds: newFeedContents,
        origins: newOrigins
      };
      fs.writeFile(`${jsonDirectory}/database.json`, JSON.stringify(result));
      response.status(200).json({});
    } else {
      response.status(416).json('Request failed: number of request properties is not satisfied.');
    }
  }
}