import RedditController from './controllers/reddit.controller';
import { album_type, Release } from './interfaces/music.interface';

console.log('running');

const redditController = new RedditController();

const release: Release = {
  name: 'kaytramine',
  artists: [
    { name: 'KAYTRAMINÉ', id: '5oifjQw72WO7Jut07fVWMy' },
    { name: 'Aminé', id: '3Gm5F95VdRxW3mqCn8RPBJ' },
    { name: 'KAYTRANADA', id: '6qgnBH6iDM91ipVXv28OMu' },
  ],
  id: '2sUImfbz5cpAW50SiQla4h',
  type: album_type.album,
};

redditController.queryRelease(release);
