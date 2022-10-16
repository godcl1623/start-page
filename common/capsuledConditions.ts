export const isFrontBiggerThanRead = <T>(front: T, rear: T, shouldContainEqual = false) =>
  shouldContainEqual ? front >= rear : front > rear;

export const isRearBiggerThanFront = <T>(front: T, rear: T, shouldContainEqual = false) =>
  shouldContainEqual ? front <= rear : front < rear;

export const areEqual = <T>(front: T, rear: T) => front === rear;

export const aOrB = <T>(a: T, b: T) => a || b;

export const aAndB = <T>(a: T, b: T) => a && b;
