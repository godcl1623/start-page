export const isFrontBiggerThanRear = <T>(
    front: T,
    rear: T,
    shouldContainEqual = false
) => (shouldContainEqual ? front >= rear : front > rear);

export const isRearBiggerThanFront = <T>(
    front: T,
    rear: T,
    shouldContainEqual = false
) => (shouldContainEqual ? front <= rear : front < rear);

export const areEqual = <T>(front: T, rear: T) => front === rear;

export const isSatisfyingAOrB = <T>(a: T, b: T) => a || b;

export const isSatisfyingBothAAndB = <T>(a: T, b: T) => a && b;

export const isNull = <T>(target: T) => target == null;
