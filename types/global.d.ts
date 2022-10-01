export interface FeedsObjectType {
  id: number;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  origin: string;
  isRead: boolean;
  isFavorite: boolean;
  [key: string]: number | string | boolean;
}

export interface FeedsSourceType {
  id: number;
  originName: string;
  originLink: string;
}

export interface ParseResultType {
  feedsObjectArray: FeedsObjectType[];
  feedsSourceArray: FeedsSourceType[];
}