// ========================================
// REGISTRA O SERVICE WORKER
// ========================================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", function () {

        navigator.serviceWorker.register("./sw.js")

            .then(function () {

                console.log(
                    "Service Worker registrado com sucesso!"
                );

            })

            .catch(function (erro) {

                console.error(
                    "Erro ao registrar o Service Worker:",
                    erro
                );

            });

    });

}


// ========================================
// URLS DAS APIS
// ========================================

// API que encontra a cidade
const GEO_URL =
    "https://geocoding-api.open-meteo.com/v1/search";

// API que fornece o clima
const CLIMA_URL =
    "https://api.open-meteo.com/v1/forecast";


// ========================================
// ELEMENTOS DO HTML
// ========================================

const campoCidade =
    document.getElementById("cidade");

const botaoBuscar =
    document.getElementById("buscar");

const resultado =
    document.getElementById("resultado");


// ========================================
// VERIFICA SE OS ELEMENTOS EXISTEM
// ========================================

console.log("Campo cidade:", campoCidade);

console.log("Botão:", botaoBuscar);

console.log("Resultado:", resultado);


// ========================================
// EVENTO DO BOTÃO
// ========================================

botaoBuscar.addEventListener(
    "click",
    buscarClima
);


// ========================================
// PERMITE USAR ENTER
// ========================================

campoCidade.addEventListener(
    "keydown",
    function (evento) {

        if (evento.key === "Enter") {

            buscarClima();

        }

    }
);


// ========================================
// FUNÇÃO PRINCIPAL
// ========================================

function buscarClima() {

    // Pega o nome digitado
    const cidade =
        campoCidade.value.trim();


    // ====================================
    // VERIFICA CAMPO VAZIO
    // ====================================

    if (cidade === "") {

        resultado.innerHTML = `
            <div class="erro">
                Digite o nome de uma cidade.
            </div>
        `;

        return;

    }


    // ====================================
    // MOSTRA CARREGAMENTO
    // ====================================

    resultado.innerHTML = `
        <p>
            Consultando o clima...
        </p>
    `;


    // ====================================
    // PRIMEIRA API
    // ENCONTRA A CIDADE
    // ====================================

    const urlCidade =
        GEO_URL +
        "?name=" +
        encodeURIComponent(cidade) +
        "&count=1" +
        "&language=pt" +
        "&format=json";


    console.log(
        "Consultando cidade:",
        urlCidade
    );


    fetch(urlCidade)

        .then(function (resposta) {

            console.log(
                "Resposta da cidade:",
                resposta
            );


            if (!resposta.ok) {

                throw new Error(
                    "Erro ao consultar a cidade."
                );

            }


            return resposta.json();

        })


        .then(function (dadosCidade) {

            console.log(
                "Dados da cidade:",
                dadosCidade
            );


            // Verifica se encontrou a cidade
            if (
                !dadosCidade.results ||
                dadosCidade.results.length === 0
            ) {

                throw new Error(
                    "Cidade não encontrada."
                );

            }


            // Pega o primeiro resultado
            const cidadeEncontrada =
                dadosCidade.results[0];


            const latitude =
                cidadeEncontrada.latitude;


            const longitude =
                cidadeEncontrada.longitude;


            console.log(
                "Latitude:",
                latitude
            );


            console.log(
                "Longitude:",
                longitude
            );


            // ====================================
            // SEGUNDA API
            // BUSCA O CLIMA
            // ====================================

            const urlClima =
                CLIMA_URL +
                "?latitude=" +
                latitude +
                "&longitude=" +
                longitude +
                "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code";


            console.log(
                "Consultando clima:",
                urlClima
            );


            return fetch(urlClima);

        })


        .then(function (resposta) {

            console.log(
                "Resposta do clima:",
                resposta
            );


            if (!resposta.ok) {

                throw new Error(
                    "Erro ao consultar o clima."
                );

            }


            return resposta.json();

        })


        .then(function (dadosClima) {

            console.log(
                "Dados do clima:",
                dadosClima
            );


            // ====================================
            // PEGA OS DADOS
            // ====================================

            const temperatura =
                dadosClima.current.temperature_2m;


            const umidade =
                dadosClima.current.relative_humidity_2m;


            const vento =
                dadosClima.current.wind_speed_10m;


            const codigo =
                dadosClima.current.weather_code;


            // ====================================
            // INTERPRETA A CONDIÇÃO
            // ====================================

            const condicao =
                interpretarClima(codigo);


            // ====================================
            // MOSTRA NA TELA
            // ====================================

            resultado.innerHTML = `

                <div class="card-clima">

                    <h2>${cidade}</h2>

                    <p>
                        🌡️ Temperatura:
                        <strong>
                            ${temperatura} °C
                        </strong>
                    </p>

                    <p>
                        ☁️ Condição:
                        <strong>
                            ${condicao}
                        </strong>
                    </p>

                    <p>
                        💧 Umidade:
                        <strong>
                            ${umidade}%
                        </strong>
                    </p>

                    <p>
                        💨 Vento:
                        <strong>
                            ${vento} km/h
                        </strong>
                    </p>

                </div>

            `;

        })


        // ====================================
        // TRATAMENTO DE ERRO
        // ====================================

        .catch(function (erro) {

            console.error(
                "ERRO NA CONSULTA:",
                erro
            );


            resultado.innerHTML = `

                <div class="erro">

                    <strong>
                        Não foi possível consultar o clima.
                    </strong>

                    <p>
                        Verifique o nome da cidade
                        e tente novamente.
                    </p>

                </div>

            `;

        });

}


// ========================================
// INTERPRETA O CÓDIGO DO CLIMA
// ========================================

function interpretarClima(codigo) {

    if (codigo === 0) {

        return "Céu limpo";

    }


    if (codigo >= 1 && codigo <= 3) {

        return "Nublado";

    }


    if (codigo >= 45 && codigo <= 48) {

        return "Neblina";

    }


    if (codigo >= 51 && codigo <= 67) {

        return "Chuva";

    }


    if (codigo >= 71 && codigo <= 77) {

        return "Neve";

    }


    if (codigo >= 80 && codigo <= 82) {

        return "Pancadas de chuva";

    }


    if (codigo >= 95 && codigo <= 99) {

        return "Tempestade";

    }


    return "Condição desconhecida";

}