// ========================================
// NOME DO CACHE
// ========================================

const CACHE_NAME = "consulta-clima-v2";


// ========================================
// ARQUIVOS DO SITE
// ========================================

const ARQUIVOS_PARA_CACHE = [

    "./",

    "./index.html",

    "./style.css",

    "./script.js",

    "./manifest.json",

    "./icons/icon-192.png",

    "./icons/icon-512.png"

];


// ========================================
// INSTALAÇÃO
// ========================================

self.addEventListener(
    "install",
    function (event) {

        event.waitUntil(

            caches.open(CACHE_NAME)

                .then(function (cache) {

                    return cache.addAll(
                        ARQUIVOS_PARA_CACHE
                    );

                })

        );

        self.skipWaiting();

    }
);


// ========================================
// ATIVAÇÃO
// ========================================

self.addEventListener(
    "activate",
    function (event) {

        event.waitUntil(

            caches.keys()

                .then(function (nomesCaches) {

                    return Promise.all(

                        nomesCaches.map(
                            function (nomeCache) {

                                if (
                                    nomeCache !== CACHE_NAME
                                ) {

                                    return caches.delete(
                                        nomeCache
                                    );

                                }

                            }
                        )

                    );

                })

        );

        self.clients.claim();

    }
);


// ========================================
// BUSCA ARQUIVOS
// ========================================

self.addEventListener(
    "fetch",
    function (event) {

        event.respondWith(

            caches.match(event.request)

                .then(function (resposta) {

                    if (resposta) {

                        return resposta;

                    }

                    return fetch(event.request);

                })

        );

    }
);