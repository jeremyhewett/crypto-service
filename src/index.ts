import { port } from './config';
import { createApp } from './app';

createApp().then((app) => app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
}));
