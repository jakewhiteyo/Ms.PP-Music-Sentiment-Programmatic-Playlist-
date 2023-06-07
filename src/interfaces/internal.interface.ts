import { Song } from './music.interface';
import { Comment } from './reddit.interface';

export interface SongData {
  song: Song;
  comments: Comment[];
}
