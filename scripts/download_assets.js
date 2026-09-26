import fs from 'fs';
import path from 'path';
import https from 'https';

const images = [
  {
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    dest: 'assets/rooms/penthouse-royal.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    dest: 'assets/rooms/garden-villa.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    dest: 'assets/dining/dish-seabass.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80',
    dest: 'assets/dining/dish-risotto.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80',
    dest: 'assets/dining/dish-dessert.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    dest: 'assets/dining/dish-wine.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80',
    dest: 'assets/gallery/gallery-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80',
    dest: 'assets/gallery/gallery-2.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
    dest: 'assets/gallery/gallery-3.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    dest: 'assets/gallery/gallery-4.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80',
    dest: 'assets/gallery/gallery-5.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1000&q=80',
    dest: 'assets/gallery/gallery-6.jpg'
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading gallery, room, and dining assets...');
  for (const item of images) {
    try {
      const dir = path.dirname(item.dest);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      await download(item.url, item.dest);
      console.log(`Downloaded ${item.dest}`);
    } catch (e) {
      console.error(`Failed to download ${item.dest}:`, e.message);
    }
  }
  console.log('All image assets ready.');
}

run();
