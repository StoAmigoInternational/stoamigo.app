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

var precacheConfig = [["android-chrome-192x192.png","9d04df05ce8b02d10f36c4a42e2d84c6"],["android-chrome-512x512.png","281543c4d38e9b1ad0bfc1b6fb7a872d"],["apple-touch-icon.png","e43bd1797c69e248f8b1835042c6a79e"],["assets/icons-nav.svg","3ca51f7f94cf019c1e7bb0bf281e3492"],["assets/iphone-x-shell.png","1fbc7fc93b1e5a178cb5588c42f88a90"],["assets/macbook.png","8ae9afaa3574a995d8bca7dede916f98"],["favicon-16x16.png","f08ece3887d5cf921f29b2ff5d8286d9"],["favicon-32x32.png","a5db06ae2f6caa8481bdbdad04530a5c"],["logo.png","25482096a75e6999089a2d6e5a9401cc"],["manifest.json","e467f6142a917f0ac22d5695ed851b9f"],["mstile-150x150.png","0302a90038053d66431c2f289481ced7"],["pages/about/01.png","1abd4eeaf1359c6f5c6a87d18218177c"],["pages/about/02.png","d6d22b3bbfb70e6337afc345bfe0aa4d"],["pages/about/03.png","8129a60e5847c318d2b553fc35a8f7b5"],["pages/about/04.png","47a4f609f661c247b3fb1a983d8f7104"],["pages/about/blog.png","d534826e1452548ca7934f82e163d266"],["pages/about/branding.png","793fda084ffd3620c9d00e2a6613d36d"],["pages/about/careers.png","4104c203e9883c3bc686b2ffdc0113ea"],["pages/about/contact-us.png","5096ceacff781a9208622c05e61ee7f1"],["pages/about/help-center.png","4f43e77512ec98e15aa1f2ca7e24bd21"],["pages/about/news.png","ee4ce4ca4c50d95328ff2a222861fd66"],["pages/about/our-team.png","ebc9bf0d38157f2379bb1e2e1aca0634"],["pages/about/press-kit.png","d3427a9d022214481016dc841a13a1eb"],["pages/access/01.png","ac10a8b94b4cf84b84a798b172238181"],["pages/access/02.png","f913e05eb31970af1ba4e0160dd18bdb"],["pages/access/hero.png","fc44c25d176e769115a20b44692c885a"],["pages/home/01.jpg","8e5f276ca0550a407b7a7944b488ba1e"],["pages/home/02.jpg","bb687971627557b1862fb3f5c73d4979"],["pages/home/03.jpg","aa6cfce6425e2b67f890e0b5b5a7f010"],["pages/home/04.jpg","e550567b140a843d087a942191e47145"],["pages/home/05.jpg","13165e41cea564e90acd87be4707ce33"],["pages/home/06.jpg","c5f618ae2817697d5686dcc6b1f9ac1e"],["pages/home/07.jpg","74b64ac920b3884044aeeda8b4cb1d10"],["pages/home/08.jpg","3e1106d09a49791aa0b4448af38b9fa6"],["pages/home/09.jpg","8ec82fbadd09de7baf410e8cf30e8fa6"],["pages/home/10.jpg","7f526e8d61a7b577cde116b2d15b8b44"],["pages/home/11.jpg","07718edb7d9d1ae0fd6a182a7508ba83"],["pages/home/12.jpg","0d097e57f98c40c01da8dc971fe32db3"],["pages/home/13.jpg","254d371de7fe6368bc88445e2012d237"],["pages/home/14.jpg","5e613634d3d06106ea37c2def73b6279"],["pages/home/15.jpg","baf958ce2c2da83828453b816b1bc7b2"],["pages/home/16.jpg","9f6db16898d242eb04895aab4bdc37f4"],["pages/home/hero.png","768cb35d431b04230cab8baf4ff5283c"],["pages/home/hero.svg","28e0ddb3e225b49cd7df32064efb5124"],["pages/home/people.jpg","f769b15220df102d443541913983183c"],["pages/sharing/ui-mobile-01.png","ee8ea9cdeb0a6e911bf1ea35d9ac0fb5"],["pages/team/large-ben-ow.jpg","507e542c21c30fcfa769c79cce52141c"],["pages/team/large-dave-kaplan.jpg","7928ee0277f2639b1702d4aa77b4e042"],["pages/team/large-diana-zhang.jpg","61dc4368257f655ac6015a5425d59db6"],["pages/team/large-dmitry-kogosov.jpg","cdacb8ab7c611510becfa37c929f1b21"],["pages/team/large-dmytro-ashkinazi.jpg","c7224a2ef605defbd080497c11aeee9a"],["pages/team/large-jeremy-forsberg.jpg","31f777b16baca9ef5ff5f2e09279d802"],["pages/team/large-rick-stiles.jpg","deff1b495dae72b50eb296d19443716f"],["pages/team/large-sandy-zhou.jpg","52c2306179d7a7407af99242c8bb535b"],["pages/team/large-tony-tan.jpg","501b6d009bfc605dc7263f4bfc7b548f"],["pages/team/profiles.json","b94834a3683c79d23c39b5dc4ecc6332"],["pages/team/small-ben-ow.jpg","b74f59a4dd05379317421673aa4cc490"],["pages/team/small-dave-kaplan.jpg","61e425d3a778923b96727d37b5536ba4"],["pages/team/small-diana-zhang.jpg","651af3f92a933fc1afc896984a1cd1c2"],["pages/team/small-dmitry-kogosov.jpg","0fe5b34c9307b53f4ef9223ead150bb3"],["pages/team/small-dmytro-ashkinazi.jpg","9281445f235cee951adc3387eaaac81f"],["pages/team/small-jeremy-forsberg.jpg","5fa878103d29ebf450aaea1180368206"],["pages/team/small-rick-stiles.jpg","5ecbced0eaf28cfc45f699495eefdff9"],["pages/team/small-sandy-zhou.jpg","85cb0c7a76663f8678cf925c8eef1e75"],["pages/team/small-tony-tan.jpg","54909899ff5bd88aefaa493d0a1174d2"],["safari-pinned-tab.svg","91dc6a5c5805e9c3199485f5adafd9d0"]];
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







