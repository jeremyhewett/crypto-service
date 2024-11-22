import { port } from '../config';
import { createApp, destroyApp } from './app';

process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  await destroyApp();
  process.exit(0);
});

createApp().then((app) => app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
}));
