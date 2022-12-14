export interface ParsedFeedsDataType {
  id: string;
  title: string | null;
  description: string | null;
  link: string | null;
  pubDate: string | null;
  origin: string | null;
  isRead: boolean;
  isFavorite: boolean;
  [key: string]: number | string | boolean | null;
}

export interface ParseResultType {
  id: number;
  originName: string | null;
  originLink: string | null;
  lastFeedsLength: number;
  latestFeedTitle: string | null;
  feeds?: ParsedFeedsDataType[];
}
