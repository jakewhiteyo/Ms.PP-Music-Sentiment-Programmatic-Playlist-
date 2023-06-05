export interface Posting {
  title: string;
  id: string;
  subreddit: string;
  description?: string;
  comments?: Comment[];
}
export interface Comment {
  text: string;
  score: number;
}
