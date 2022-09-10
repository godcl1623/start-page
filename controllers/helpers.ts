import { FeedsObjectType } from 'types/global';

interface ConcatGenericType {
  title?: string | null;
  originName?: string | null;
}

export const checkIfPOSTRequestValid = (feedsObjectArray: FeedsObjectType[]) => {
  return feedsObjectArray.filter((feedsObject: FeedsObjectType) => Object.keys(feedsObject).length < 8).length;
};

export const concatOverlayWithNewData = <T extends ConcatGenericType>(originalContentsArray: T[], newArray: T[]) => {
  if (originalContentsArray.length === 0) {
    return originalContentsArray.concat(newArray);
  } else {
    const overlayFiltered = newArray.filter((newData: T) => {
      if ('title' in newData) {
        return !originalContentsArray.some((storedData: T) => storedData.title === newData.title);
      } else if ('originName' in newData) {
        return !originalContentsArray.some((storedData: T) => storedData.originName === newData.originName);
      }
    });
    return originalContentsArray.concat(overlayFiltered);
  }
};
