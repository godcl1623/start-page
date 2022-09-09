type AddressKeys = 'Google' | 'Naver' | 'Daum' | 'MDN' | 'CanIUse' | 'GitHub';

type AddressValues = {
  [key in AddressKeys]: string;
}

export const SEARCH_ADDRESS_BY_ENGINE: AddressValues = {
  'Google': 'https://www.google.com/search?q=',
  'Naver': 'https://search.naver.com/search.naver?query=',
  'Daum': 'https://search.daum.net/search?q=',
  'MDN': 'https://developer.mozilla.org/ko/search?q=',
  'CanIUse': 'https://caniuse.com/?search=',
  'GitHub': 'https://github.com/search?q=',
};
