import { FeedsObjectType } from 'types/global';

interface ConcatGenericType {
  title?: string | null;
  originName?: string | null;
}

export const returnMutationRequestKeys = (feedsObjectArray: FeedsObjectType[]) => {
  return feedsObjectArray.filter(
    (feedsObject: FeedsObjectType) => Object.keys(feedsObject).length < 8
  ).length;
};

export const concatOverlayWithNewData = <T extends ConcatGenericType>(
  originalContentsArray: T[],
  newArray: T[]
) => {
  if (originalContentsArray.length === 0) {
    return originalContentsArray.concat(newArray);
  } else {
    const overlayFiltered = newArray.filter((newData: T) => {
      if ('title' in newData) {
        return !originalContentsArray.some((storedData: T) => storedData.title === newData.title);
      } else if ('originName' in newData) {
        return !originalContentsArray.some(
          (storedData: T) => storedData.originName === newData.originName
        );
      }
    });
    return originalContentsArray.concat(overlayFiltered);
  }
};

export const concatNewDataByReplaceOldElement = <T extends { id: number }>(
  oldArray: T[],
  newData: T
) => {
  const oldElementHavingSameIdWithNewData = oldArray.find(
    (oldElement: T) => oldElement.id === newData.id
  );
  const indexOfOldElementHavingSameId = oldArray.indexOf(oldElementHavingSameIdWithNewData as T);
  const arrayIncludesSameId = oldArray.slice(0, indexOfOldElementHavingSameId + 1);
  const arrayWithoutSameId = oldArray.slice(indexOfOldElementHavingSameId + 1);
  const arrayWithNewData =
    arrayIncludesSameId.length === 1
      ? [newData]
      : arrayIncludesSameId.slice(0, arrayIncludesSameId.length - 1).concat([newData]);

  return arrayWithNewData.concat(arrayWithoutSameId);
};
