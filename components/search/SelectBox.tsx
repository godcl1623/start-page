import { SEARCH_ADDRESS_BY_ENGINE } from './utils/constants';

export default function SelectBox() {
  const searchEngineOptions = Object.keys(SEARCH_ADDRESS_BY_ENGINE).map(
    (searchEngine: string, index: number) => (
      <option key={`${searchEngine[0]}_${index}`}>{searchEngine}</option>
    )
  );

  return (
    <select
      name='searchEngines'
      className='h-full rounded-l-md px-2 text-gray-400 dark:focus:outline-sky-600'
    >
      {searchEngineOptions}
    </select>
  );
}
