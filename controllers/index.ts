import { NextApiRequest } from 'next';
import { FeedsObjectType, FeedsSourceType } from 'types/global';
import { checkIfPOSTRequestValid, concatOverlayWithNewData } from './helpers';

export const handlePOSTRequest = (request: NextApiRequest, fileContents: string) => {
  const { feedsObjectArray, feedsSourceArray } = request.body;
  const numberOfKeysLessThanEight = checkIfPOSTRequestValid(feedsObjectArray);
  if (numberOfKeysLessThanEight === 0) {
    const { feeds, origins } = JSON.parse(fileContents);
    const newFeedContents = concatOverlayWithNewData<FeedsObjectType>(feeds, feedsObjectArray);
    const newOrigins = concatOverlayWithNewData<FeedsSourceType>(origins, feedsSourceArray);
    return {
      feeds: newFeedContents,
      origins: newOrigins,
    };
  } else {
    return false;
  }
};
