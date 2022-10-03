import { NextApiRequest } from 'next';
import { FeedsObjectType, FeedsSourceType } from 'types/global';
import {
  returnMutationRequestKeys,
  concatOverlayWithNewData,
  concatNewDataByReplaceOldElement,
} from './helpers';

export const handlePOSTRequest = (request: NextApiRequest, fileContents: string) => {
  const { feedsObjectArray, feedsSourceArray } = request.body;
  const numberOfKeysLessThanEight = returnMutationRequestKeys(feedsObjectArray);
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

export const handlePATCHRequest = (request: NextApiRequest, fileContents: string) => {
  const newData = request.body;
  const numberOfKeysLessThanEight = returnMutationRequestKeys([newData]);
  if (numberOfKeysLessThanEight === 0) {
    const { feeds, origins } = JSON.parse(fileContents);
    const feedsArrayWithNewData = concatNewDataByReplaceOldElement(feeds, newData);
    return {
      feeds: feedsArrayWithNewData,
      origins,
    };
  } else {
    return false;
  }
};
