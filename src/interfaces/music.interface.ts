import { Comment } from './reddit.interface';

export enum album_type {
  album = 'album',
  single = 'single',
}
export interface Artist {
  name: string;
  id: string;
}
export interface Release {
  name: string;
  id: string;
  artists: Artist[];
  type: album_type;
  songs?: Song[];
  positive?: number;
  negative?: number;
}
export interface Song {
  name: string;
  id: string;
  artists?: any;
}
export interface Album {
  name: string;
  id: string;
  songs: Song[];
}
