import { Song } from './music.interface';
import { Comment } from './reddit.interface';

export interface SongComments {
  song: Song[];
  comments: Comment[];
}
