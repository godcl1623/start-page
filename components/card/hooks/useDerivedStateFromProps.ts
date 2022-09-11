import React from 'react';

const useDerivedStateFromProps = <T>(
  propsToMakeState: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [stateToDifferentiate, setState] = React.useState<T | null>(null);

  React.useEffect(() => {
    if (propsToMakeState !== stateToDifferentiate) setState(propsToMakeState);
  }, []);

  return [stateToDifferentiate as T, setState as React.Dispatch<React.SetStateAction<T>>];
};

export default useDerivedStateFromProps;
