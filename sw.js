// ================================
// NOME DO CACHE
// ================================

const CACHE_NAME = "consulta-clima-v1";


// ================================
// ARQUIVOS QUE SERÃO GUARDADOS
// ================================

const ARQUIVOS_PARA_CACHE = [

    "./",

    "./index.html",

    "./style.css",

    "./script.js",

    "./manifest.json",

    "./icons/icon-192.png",

    "./icons/icon-512.png"

];


// ================================
// INSTALAÇÃO DO SERVICE WORKER
// ================================

self.addEventListener("install", function(event) {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(function(cache) {

                return cache.addAll(ARQUIVOS_PARA_CACHE);

            })

    );

});


// ================================
// BUSCA DOS ARQUIVOS
// ================================

self.addEventListener("fetch", function(event) {

    event.respondWith(

        caches.match(event.request)

            .then(function(resposta) {

                if (resposta) {

                    return resposta;

                }

                return fetch(event.request);

            })

    );

});