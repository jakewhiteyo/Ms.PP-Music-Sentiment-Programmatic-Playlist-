import { Release, album_type } from '../interfaces/music.interface';
import { Posting } from '../interfaces/reddit.interface';
import RedditController from './reddit.controller';

const redditController = new RedditController();

test('isRelevant', () => {
  const release: Release = {
    name: 'kaytramine',
    artists: [
      { name: 'KAYTRAMINÉ', id: '5oifjQw72WO7Jut07fVWMy' },
      { name: 'Aminé', id: '3Gm5F95VdRxW3mqCn8RPBJ' },
      { name: 'KAYTRANADA', id: '6qgnBH6iDM91ipVXv28OMu' },
    ],
    id: '2sUImfbz5cpAW50SiQla4h',
    type: album_type.single,
  };

  const postWithRelevantTitle: Posting = {
    title: 'this kaytramine album is insane',
    id: 'bitch12',
    subreddit: 'amine',
    description: 'This shit is gas',
  };

  const postWithRelevantDescription: Posting = {
    title: 'what do you guys think about this',
    id: 'bitch12',
    subreddit: 'amine',
    description: 'This kaytramine shit is gas',
  };

  const postWithNoRelevance: Posting = {
    title: 'this is completely unrelated to anything',
    id: 'bitch25',
    subreddit: 'notinteresting',
    description: 'wordddd',
  };
  let isRelevant = false;
  isRelevant = redditController.isRelevant(release, postWithRelevantTitle);
  expect(isRelevant).toBe(true);
  isRelevant = redditController.isRelevant(release, postWithRelevantDescription);
  expect(isRelevant).toBe(true);
  isRelevant = redditController.isRelevant(release, postWithNoRelevance);
  expect(isRelevant).toBe(false);
});

jest.setTimeout(100000);

const kaytraRelease = {
  name: 'KAYTRAMINÉ',
  id: '1plAqF2W8hwAhcpBAfGNsW',
  artists: [
    { name: 'KAYTRAMINÉ', id: '5oifjQw72WO7Jut07fVWMy' },
    { name: 'Aminé', id: '3Gm5F95VdRxW3mqCn8RPBJ' },
    { name: 'KAYTRANADA', id: '6qgnBH6iDM91ipVXv28OMu' },
  ],
  type: album_type.album,
  songs: [
    { name: 'Who He Iz', id: '02nhDSWvcXYALyVkth2oXd' },
    { name: 'letstalkaboutit', id: '0Z4oNNgJKK9VcuSw1L5Cb4' },
    { name: '4EVA', id: '2sUImfbz5cpAW50SiQla4h' },
    { name: 'Westside', id: '4KZytfFyq6cFObYt40KQmj' },
    { name: 'Master P', id: '6tEpOijHrGLidCtHeoMhlC' },
    { name: 'Rebuke', id: '4doxCAkqckpGTasPN6ByUu' },
    { name: 'Sossaup', id: '6y5UMIVVJDsULZwfZ0bNRX' },
    { name: 'STFU3', id: '4yhDEazA79jDuJkRp1oVlS' },
    { name: 'UGH UGH', id: '2eruQnjO91iZFeneO7gh1y' },
    { name: 'EYE', id: '4jbNm7D0YvHMS1MZ6hJaOf' },
    { name: 'K&A', id: '4FyH1gsB85ivmvFtkvxgir' },
  ],
};

const kaytraPost = {
  title: "In your opinion, what's the best song on KAYTRAMINÉ?",
  id: '13tyjvq',
  subreddit: 'Amine',
  description: '',
};

test('get album posts', async () => {
  const posts: Posting[] = await redditController.getAlbumPosts(kaytraRelease);
});

test('get post comments', async () => {
  const comments = await redditController.getPostComments(kaytraRelease, [kaytraPost]);
  console.log('comments', comments);
});
test.only('link comments', async () => {
  const comments = await redditController.getPostComments(kaytraRelease, [kaytraPost]);
  const songData = await redditController.linkComments(kaytraRelease, comments);
  console.dir(songData, { depth: null });
});
