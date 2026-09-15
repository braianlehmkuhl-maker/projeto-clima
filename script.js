// ================================
// REGISTRA O SERVICE WORKER
// ================================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", function() {

        navigator.serviceWorker.register("sw.js")

            .then(function() {

                console.log("Service Worker registrado com sucesso.");

            })

            .catch(function(erro) {

                console.error(
                    "Erro ao registrar o Service Worker:",
                    erro
                );

            });

    });

}