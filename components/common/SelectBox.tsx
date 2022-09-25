type ObjectType = {
  [key in string]: string;
};

interface Props {
  optionValues: string[] | ObjectType;
  customStyles?: string;
}

export default function SelectBox({ optionValues, customStyles }: Props) {
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

  return (
    <select
      name='searchEngines'
      className={`h-full px-2 text-gray-400 dark:focus:outline-sky-600 ${customStyles}`}
    >
      {options}
    </select>
  );
}
