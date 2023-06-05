import axios from 'axios';
import { Release, album_type } from '../interfaces/music.interface';
import { Posting } from '../interfaces/reddit.interface';

const redditInstance = axios.create({
  baseURL: 'https://reddit.com/',
  timeout: 10000,
  // headers: { 'X-Custom-Header': 'foobar' },
});

class RedditController {
  // validate reddit post relevancy
  public isRelevant = function (release: Release, post: Posting): boolean {
    // check if post contains album/single name
    if (post.title.includes(release.name) || post.description?.includes(release.name)) return true;
    // check if post contains artist name
    for (let i = 0; i < release.artists.length; i++) {
      const artist = release.artists[i];
      if (post.title.includes(artist.name) || post.description?.includes(artist.name)) return true;
    }
    // for albums, check if post contains a song name
    if (release.type === album_type.album) {
      for (let i = 0; i < release.songs.length; i++) {
        const song = release.songs[i];
        if (post.title.includes(song.name)) return true;
      }
    }
    return false;
  };

  public newPost = function (newPost: Posting, posts: Posting[]): boolean {
    for (const post of posts) {
      if (post.id === newPost.id) return false;
    }
    return true;
  };

  // process for handling albums
  public getAlbumPosts = async function (release: Release): Promise<Posting[]> {
    // collect relevant posts
    const posts = [];
    const searches = [];
    try {
      // search {album name}
      searches.push(
        `/search.json?q=${release.name}%20${release.artists[0]}&include_over_18=1&t=week`,
      );
      // search {album name} {artist name}
      release.artists.forEach((artist) => {
        searches.push(`/search.json?q=${release.name}%20${artist.name}&include_over_18=1&t=week`);
      });
      // search {album name} {artist name}
      release.songs.forEach((song) => {
        searches.push(`/search.json?q=${song.name}%20${release.name}&include_over_18=1&t=week`);
      });
      console.log(`${searches.length} searches`);
      // query searches
      for (const search of searches) {
        // console.log('search', search);
        const query: any = await redditInstance.get(search, {
          params: { sort: 'relevance', limit: 5 },
        });
        query?.data?.data?.children.forEach((child) => {
          // console.log(child.data.title);
          const post: Posting = {
            title: child.data.title,
            id: child.data.id,
            subreddit: child.data.subreddit,
            description: child.data?.selftext,
          };
          if (this.isRelevant(release, post) && this.newPost(post, posts)) posts.push(post);
        });
      }
      console.log(`${posts.length} posts`);
    } catch (e) {
      console.log('error: ', e);
    }
    return posts;
  };

  // process for handling singles
  public getSinglePosts = async function (release: Release) {
    const search = `/search.json?q=${release.name}%20${release.artists[0]}&include_over_18=1&t=week`;
    const query = await redditInstance.get(search, {
      params: { sort: 'relevance', limit: 5 },
    });
    console.dir(query.data.data.children, { depth: null });
  };

  public getPostComments = async function (release: Release, posts: Posting[]): Promise<Comment[]> {
    const comments = [];
    // console.log('release', release);
    // console.log('posts', posts);
    for (const post of posts) {
      const search = `/comments/${post.id}.json`;
      const query: any = await redditInstance.get(search);
      // query.data[0] is the comment from the post author, IDK if that is helpful to us
      const queriedComments = query.data[1];
      // TODO: gather seeded comments
      queriedComments.data.children.forEach((item) => {
        const comment = { text: item.data.body, score: item.data.score };
        comments.push(comment);
      });
    }

    return comments;
  };

  public scrapeReddit = async function () {
    try {
      const scrape = await redditInstance.get('/r/GriseldaxFR/hot.json', { params: { limit: 2 } });
      //console.log('scrape', scrape.data);
      //console.dir(scrape.data.data.children, { depth: null });
      scrape.data.data.children.map((e) => console.dir(e.data.title, { depth: null }));
    } catch (e) {
      console.log('e', e);
    }
  };

  // driver method for processing a release
  public queryRelease = async function (release: Release) {
    let posts = [];
    switch (release.type) {
      case album_type.album:
        posts = await this.getAlbumPosts(release);
      case album_type.single:
        posts = await this.getSinglePosts(release);
    }
  };
}
export default RedditController;
