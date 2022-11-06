import React from 'react';
import { SORT_STANDARD } from 'common/constants';

type ObjectType = {
  [key in string]: string;
};

interface Props {
  optionValues: string[] | ObjectType;
  customStyles?: string;
  setSortState?: (stateString: string, stateStringArray: string[]) => void;
}

export default function SelectBox({ optionValues, customStyles, setSortState }: Props) {
  let options: JSX.Element[] = [];
  if (Array.isArray(optionValues)) {
    options = options
      .slice()
      .concat(
        optionValues.map((optionValue: string, index: number) => (
          <option key={`${optionValue}_${index}`}>{optionValue}</option>
        ))
      );
  } else if (optionValues instanceof Object) {
    options = options
      .slice()
      .concat(
        Object.keys(optionValues).map((searchEngine: string, index: number) => (
          <option key={`${searchEngine[0]}_${index}`}>{searchEngine}</option>
        ))
      );
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (setSortState) setSortState(event.currentTarget.value, SORT_STANDARD);
  };

  return (
    <select
      name='searchEngines'
      className={`h-full px-2 text-gray-400 dark:focus:outline-sky-600 ${customStyles}`}
      onChange={handleChange}
    >
      {options}
    </select>
  );
}
