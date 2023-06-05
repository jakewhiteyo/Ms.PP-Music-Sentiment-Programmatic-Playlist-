import axios from 'axios';
import { config } from '../../config';
import { album_type, Release, Song } from '../interfaces/music.interface';

const spotifyInstance = axios.create({
  baseURL: 'https://api.spotify.com/v1/',
  timeout: 10000,
});

const spotifyAccountInstance = axios.create({
  baseURL: 'https://accounts.spotify.com/',
  timeout: 10000,
});

class SpotifyController {
  public getSpotifyToken = async function (): Promise<string> {
    try {
      const headers = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(config.SPOTIFY_CLIENT_ID + ':' + config.SPOTIFY_CLIENT_SECRET).toString(
              'base64',
            ),
        },
        params: {
          grant_type: 'client_credentials',
        },
      };
      const request = await spotifyAccountInstance.post('api/token', null, headers);
      return request.data.access_token;
    } catch (e) {
      console.log('failed to generate client oauth token');
      return null;
    }
  };
  public getSpotifyReleases = async function (token: string) {
    try {
      const headers = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const scrape = await spotifyInstance.get('browse/new-releases?limit=50', headers);
      //console.dir(scrape.data, { depth: null });
      const releases: Release[] = scrape.data.albums.items.map((e) => {
        return {
          name: e.name,
          id: e.id,
          artists: e.artists.map((a) => {
            return {
              name: a.name,
              id: a.id,
            };
          }),
          type: e.album_type === 'album' ? album_type.album : album_type.single,
        };
      });
      return releases;
    } catch (e) {
      console.dir(e, { depth: null });
    }
  };
  public getAlbumSongs = async function (token: string, album: Release): Promise<Song[]> {
    try {
      const headers = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const request = await spotifyInstance.get(`albums/${album.id}/tracks`, headers);
      const songs: Song[] = request.data.items.map((item) => {
        return {
          id: item.id,
          name: item.name,
          artists: item.artists.map((a) => {
            return a;
          }),
        };
      });
      return songs;
    } catch (e) {
      console.dir(e, { depth: null });
    }
  };
  public getLikedArtists = async function (token: string) {
    try {
      const headers = {
        headers: {
          Authorization:
            'Authorization: Bearer BQChhUbMqX-dk66XhOk1eXwP5oQB-tR8F1s8-p5RAf2dQPYTE1FfzlRigypwKlFnN8YuxZp5Od21Yr_rgO1XFp1YxY8Y_kmLn3AmLjGo71jG4qqJ6y_t',
        },
      };
      console.log('headers', headers);
      const request = await spotifyInstance.get(`me/tracks`, headers);
      console.log('request', request);
    } catch (e) {
      console.dir(e, { depth: null });
    }
  };
}
export default SpotifyController;
