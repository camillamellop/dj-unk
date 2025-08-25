/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';

declare let self: ServiceWorkerGlobalScope;

clientsClaim();

// pré-cache dos assets gerados no build
precacheAndRoute(self.__WB_MANIFEST);

// Supabase: só cacheia se não tiver authorization
registerRoute(
  ({ url, request }) => {
    if (/^https:\/\/.*\.supabase\.co\//.test(url.href)) {
      const authHeader = request.headers.get('authorization');
      return !authHeader;
    }
    return false;
  },
  new NetworkFirst({
    cacheName: 'supabase-cache',
    networkTimeoutSeconds: 10,
  })
);

// Imagens
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    matchOptions: {
      ignoreVary: true,
    },
  })
);

// Fontes
registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: 'fonts-cache',
  })
);
