/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["about.html","8a24c5b450b883d7f05c59c256753432"],["access.html","57605d4e00e48b47b707a952e6ec4cb4"],["android-chrome-192x192.png","f1035a108a58eefcd9152d9045156d87"],["android-chrome-512x512.png","11f9adf9c564f3d1318d7e4fd8975c32"],["apple-touch-icon.png","8d0d2d28ed9f59e239b1f004e425a38b"],["assets/icons-nav-alt.svg","30694c0bde405f7ccb7cd04b767d16d4"],["assets/icons-nav.svg","3ca51f7f94cf019c1e7bb0bf281e3492"],["assets/iphone-x-shell-black.png","f5ff67bfd41557c6f34c4884a18728f1"],["assets/iphone-x-shell-white.png","791d7b2809e80f504c4b6c43e8fbdcb3"],["assets/iphone-x-shell.png","1fbc7fc93b1e5a178cb5588c42f88a90"],["careers.html","133b2a978e5935a2b590f0f3e0cdd49a"],["contact.html","359ab2ce35e28a178415f7c89cb4ce70"],["copyright.html","93c58799c035458b528b194968f28c70"],["downloads.html","b5a473190e50766cecac049d7bacd701"],["error.html","8beeba2c18344224905f28c2ab565daf"],["eula.html","8b085ca2e86a76b9ee56dc498e101602"],["faq.html","35a9082569ee205f7ddeef05b0053804"],["favicon-16x16.png","5589c1a38d32a778438b54732ab58293"],["favicon-32x32.png","f60768b12db2a9be3ccf084645fdc658"],["icon.png","2f83f6aa4a72656f6bbb083ed2d1492b"],["index.html","99e78d3cac7199fa219f61fb7102fa2c"],["integration.html","87905ec46eecc152e49bf9f2502afaa1"],["logo.png","2c15106b048a2d0dc4c2078ca75910ac"],["manifest.json","e467f6142a917f0ac22d5695ed851b9f"],["mstile-150x150.png","1cb42fcbd05d24140fae4abf9dc16799"],["pages/about/01.png","878d91855af219515cec8be836bd8950"],["pages/about/02.png","ac10a8b94b4cf84b84a798b172238181"],["pages/about/03.png","1602bd07e148fb9bffc40169eb40a14c"],["pages/about/04.png","74fe4a6856addc68fb8be7e07aebaf7a"],["pages/about/blog.png","fc44c25d176e769115a20b44692c885a"],["pages/about/branding.png","d3ed2fcb5c3db247ef4bb1bf0b40ef8a"],["pages/about/careers.png","f913e05eb31970af1ba4e0160dd18bdb"],["pages/about/contact-us.png","33ce3369225adee0dbb03b547d14ff22"],["pages/about/help-center.png","0453a1098b7917fadca62942fffe1ee3"],["pages/about/news.png","7d75f05e9ee6e4107dcd77b6c8c2265a"],["pages/about/our-team.png","22176917ac6690174b92a6feceefe2ec"],["pages/about/press-kit.png","b5a27583f11b56b0f0fa9cae791ec4de"],["pages/access/01.png","ac10a8b94b4cf84b84a798b172238181"],["pages/access/02.png","f913e05eb31970af1ba4e0160dd18bdb"],["pages/access/hero.png","fc44c25d176e769115a20b44692c885a"],["pages/common/01.png","878d91855af219515cec8be836bd8950"],["pages/common/02.png","ac10a8b94b4cf84b84a798b172238181"],["pages/common/03.png","1602bd07e148fb9bffc40169eb40a14c"],["pages/common/04.png","74fe4a6856addc68fb8be7e07aebaf7a"],["pages/common/05.png","28e2bad33b628bbca6ca4e569dee763e"],["pages/common/06.png","fc44c25d176e769115a20b44692c885a"],["pages/common/07.png","d3ed2fcb5c3db247ef4bb1bf0b40ef8a"],["pages/common/08.png","0453a1098b7917fadca62942fffe1ee3"],["pages/common/09.png","b5a27583f11b56b0f0fa9cae791ec4de"],["pages/common/10.png","33ce3369225adee0dbb03b547d14ff22"],["pages/common/11.png","7d75f05e9ee6e4107dcd77b6c8c2265a"],["pages/common/12.png","22176917ac6690174b92a6feceefe2ec"],["pages/common/13.png","f913e05eb31970af1ba4e0160dd18bdb"],["pages/common/14.png","70ddcc21279c683cee0eaecf5d459f1f"],["pages/common/15.png","bd476051ffc053b994ecc8e52a65c055"],["pages/common/16.png","c41290496e66f315637c19ab699ceed1"],["pages/common/people.png","cc89cad222f510b4d5cac03087a8f9bf"],["pages/downloads/download-macos.png","f6471b35526bc672e9cff2ff14cb8de7"],["pages/downloads/download-windows.png","e25d6d09d8615664e35424c7fe099925"],["pages/home/01.png","878d91855af219515cec8be836bd8950"],["pages/home/02.png","ac10a8b94b4cf84b84a798b172238181"],["pages/home/03.png","1602bd07e148fb9bffc40169eb40a14c"],["pages/home/04.png","74fe4a6856addc68fb8be7e07aebaf7a"],["pages/home/05.png","28e2bad33b628bbca6ca4e569dee763e"],["pages/home/06.png","fc44c25d176e769115a20b44692c885a"],["pages/home/07.png","d3ed2fcb5c3db247ef4bb1bf0b40ef8a"],["pages/home/08.png","0453a1098b7917fadca62942fffe1ee3"],["pages/home/09.png","b5a27583f11b56b0f0fa9cae791ec4de"],["pages/home/10.png","33ce3369225adee0dbb03b547d14ff22"],["pages/home/11.png","7d75f05e9ee6e4107dcd77b6c8c2265a"],["pages/home/12.png","22176917ac6690174b92a6feceefe2ec"],["pages/home/13.png","f913e05eb31970af1ba4e0160dd18bdb"],["pages/home/14.png","70ddcc21279c683cee0eaecf5d459f1f"],["pages/home/15.png","bd476051ffc053b994ecc8e52a65c055"],["pages/home/16.png","c41290496e66f315637c19ab699ceed1"],["pages/home/people-accent.jpg","a2fa1a05ee9431115ecb29b48709a4f3"],["pages/home/people-brand.jpg","903447bd017da1a392664386c7790b84"],["pages/home/people-primary.jpg","22abdeb2e69c6000ac9d1431be481eae"],["pages/home/people-secondary.jpg","4fec37c1d3fdcc93e4087e2710d34ab9"],["pages/home/people.png","cc89cad222f510b4d5cac03087a8f9bf"],["pages/plans/stogo-package.png","e25d6d09d8615664e35424c7fe099925"],["pages/plans/stopro-package.png","f6471b35526bc672e9cff2ff14cb8de7"],["pages/sharing/sample.jpg","0b6183d51ceda51c9d846836c12c9f87"],["pages/sharing/ui-desktop-01.png","ce61fe5ed05cd4d699e2431cdacee7d8"],["pages/sharing/ui-mobile-01.png","ee8ea9cdeb0a6e911bf1ea35d9ac0fb5"],["pages/team/large-ben-ow.jpg","03bb234799f560e8d91b36f5229b773b"],["pages/team/large-diana-zhang.jpg","f80f4a14eb4fdcd13aba71881081af43"],["pages/team/large-dmitry-kogosov.jpg","f3224ee98ad350e8b2adf9e6fe5f8884"],["pages/team/large-dmytro-ashkinazi.jpg","0ff29f402ff80d4d6014cdd2aa1dde2e"],["pages/team/large-first-last.jpg","cd186cd508629b4fb44128366bd93fc7"],["pages/team/large-jeremy-forsberg.jpg","468f5f0ed72c6ecece650e48220c4110"],["pages/team/large-rick-stiles.jpg","65c4760bda498bfd3e8b5e3e84c91b8b"],["pages/team/large-sandy-zhou.jpg","e9b2690977df9a292f7b854a5e47fa95"],["pages/team/large-tony-tan.jpg","9cb6a49d0cc8dfac358e0a6a21d6cf0b"],["pages/team/profiles.json","1334e7f6bbb4ed85cc60d0e26f6a2fe9"],["pages/team/small-ben-ow.jpg","2944b3a55c096f27faf860038b36b144"],["pages/team/small-diana-zhang.jpg","588c818656b160c32a3cf5bc32b4721b"],["pages/team/small-dmitry-kogosov.jpg","fe9e31552e4e11fe967def272b7bbfc4"],["pages/team/small-dmytro-ashkinazi.jpg","c3ba4222357933663dde7c0a67eecb30"],["pages/team/small-first-last.jpg","01e1020369b5581a19f3eff1adabd130"],["pages/team/small-jeremy-forsberg.jpg","fa9cbbad3266bc95aef55b66f3beafa2"],["pages/team/small-rick-stiles.jpg","4ef4436d76ace0682c11c87c97aeaf1e"],["pages/team/small-sandy-zhou.jpg","01e1020369b5581a19f3eff1adabd130"],["pages/team/small-tony-tan.jpg","ff88a119f95d0b8c367c24b6425cfb45"],["plans.html","76e0d50613c7c877557d03bca13bc806"],["privacy-bill-of-rights.html","cb93ce49a24795f4d26642b3216dfc30"],["safari-pinned-tab.svg","91dc6a5c5805e9c3199485f5adafd9d0"],["scripts/app.css","d760a8ffb3e35121f69a147140689569"],["scripts/app.js","81825a6ef27e5c0e48dc4793406a3965"],["security.html","f089aceb8a0f191381376dcca02a82a4"],["sharing.html","aac7b84dc04ef4578e4757616a25bd11"],["streaming.html","27b83654dc223d4566c733f621a7a437"],["team.html","35e5f57a493c01f81da0c2b49fd89e6c"],["terms.html","7e2f4ec8d958f51989f2d7f3c5d97121"],["transfer.html","269d5da9938268b797c2b0df629ca273"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







