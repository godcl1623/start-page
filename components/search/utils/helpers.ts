import React from 'react';
import { SEARCH_ADDRESS_BY_ENGINE } from './constants';

export const extractFormValues = (event: React.FormEvent<HTMLFormElement>) => {
  const searchEngineSelectBox = event.currentTarget[0];
  const searchInput = event.currentTarget[1];
  let selectedSearchEngine = '';
  let inputValue = '';
  if (searchEngineSelectBox instanceof HTMLSelectElement)
    selectedSearchEngine = searchEngineSelectBox.value;
  if (searchInput instanceof HTMLInputElement) inputValue = searchInput.value;

  return { selectedSearchEngine, inputValue };
};

export const openSearchResult = (selectedSearchEngine: string, inputValue: string) => {
  const searchEngineIndex = Object.keys(SEARCH_ADDRESS_BY_ENGINE).indexOf(selectedSearchEngine);
  const searchAddress = Object.values(SEARCH_ADDRESS_BY_ENGINE)[searchEngineIndex];
  if (searchAddress) {
    window.location.assign(`${searchAddress}${inputValue}`);
  } else {
    throw new Error('Search address is not available');
  }
};
