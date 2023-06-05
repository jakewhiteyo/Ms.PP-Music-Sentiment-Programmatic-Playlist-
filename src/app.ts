import express from 'express';
import axios from 'axios';
import { config } from '../config';
import SpotifyController from './controllers/spotify.controller';
import { album_type, Release, Song } from './interfaces/music.interface';
import RedditController from './controllers/reddit.controller';

// const app = express();
// const port = 3000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}.`);
// });

const spotifyController = new SpotifyController();

const redditController = new RedditController();

async function main() {
  const token = await spotifyController.getSpotifyToken();
  const releases = await spotifyController.getSpotifyReleases(token);

  // get albums from releases
  const albums = releases.filter((release) => release.type === album_type.album);

  // add songs to release objects for album type
  for (const album of albums) {
    const albumSongs = await spotifyController.getAlbumSongs(token, album);
    album.songs = [];
    albumSongs.forEach((song) => {
      album.songs.push({
        name: song.name,
        id: song.id,
      });
    });
  }
  console.dir(releases, { depth: null });
  for (const release of releases) {
    // gather posts for each release
    let posts = [];
    switch (release.type) {
      case album_type.album:
        posts = await this.getAlbumPosts(release);
      case album_type.single:
        posts = await this.getSinglePosts(release);
    }
    // get comments from each post
    const comments = await redditController.getPostComments(release, posts);
    // rate each song according to the related comments
  }
  // await spotifyController.getLikedArtists(token);
}
main();
