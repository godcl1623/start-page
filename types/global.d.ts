export interface FeedsObjectType {
  id: number;
  title: string | null;
  description: string | null;
  link: string | null;
  pubDate: string | null;
  origin: string | null;
  isRead: boolean;
  isFavorite: boolean;
}

export interface FeedsSourceType {
  id: number;
  originName: string | null;
  originLink: string | null;
}

export interface ParseResultType {
  feedsObjectArray: FeedsObjectType[];
  feedsSourceArray: FeedsSourceType[];
}