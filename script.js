// ============================================
// CONFIGURAÇÃO DA API
// ============================================

// API que transforma o nome da cidade em latitude e longitude
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";

// API que fornece os dados do clima
const CLIMA_URL = "https://api.open-meteo.com/v1/forecast";


// ============================================
// ELEMENTOS DA PÁGINA
// ============================================

// Encontra o botão pelo id="buscar"
const botaoBuscar = document.getElementById("buscar");

// Encontra o campo da cidade pelo id="cidade"
const campoCidade = document.getElementById("cidade");

// Encontra a área onde o resultado será mostrado
const resultado = document.getElementById("resultado");


// ============================================
// LIGA O BOTÃO À FUNÇÃO
// ============================================

// Quando o usuário clicar no botão,
// a função buscarClima() será executada
botaoBuscar.addEventListener("click", buscarClima);


// ============================================
// PERMITE USAR A TECLA ENTER
// ============================================

// Se o usuário apertar Enter dentro do campo,
// também será feita a consulta
campoCidade.addEventListener("keydown", function(evento) {

    if (evento.key === "Enter") {

        buscarClima();

    }

});


// ============================================
// FUNÇÃO PRINCIPAL
// ============================================

function buscarClima() {

    // Pega o texto que o usuário digitou
    const cidade = campoCidade.value.trim();


    // ============================================
    // VERIFICA SE O CAMPO ESTÁ VAZIO
    // ============================================

    if (cidade === "") {

        resultado.innerHTML = `
            <p>
                Digite o nome de uma cidade.
            </p>
        `;

        return;
    }


    // ============================================
    // MOSTRA MENSAGEM DE CARREGAMENTO
    // ============================================

    resultado.innerHTML = `
        <p>
            Consultando o clima...
        </p>
    `;


    // ============================================
    // PRIMEIRA CONSULTA
    // BUSCAR A CIDADE
    // ============================================

    const urlBusca =
        `${GEO_URL}?name=${encodeURIComponent(cidade)}` +
        `&count=1&language=pt&format=json`;


    // Envia a requisição para a API
    fetch(urlBusca)

        // ========================================
        // CONVERTE A RESPOSTA PARA JSON
        // ========================================

        .then(resposta => {

            // Verifica se a requisição deu certo
            if (!resposta.ok) {

                throw new Error(
                    "Erro ao buscar a cidade."
                );

            }

            // Transforma a resposta em JSON
            return resposta.json();

        })


        // ========================================
        // RECEBE OS DADOS DA CIDADE
        // ========================================

        .then(dadosCidade => {

            // Verifica se a cidade foi encontrada
            if (
                !dadosCidade.results ||
                dadosCidade.results.length === 0
            ) {

                throw new Error(
                    "Cidade não encontrada."
                );

            }


            // Pega a latitude e longitude
            const latitude =
                dadosCidade.results[0].latitude;

            const longitude =
                dadosCidade.results[0].longitude;


            // ========================================
            // SEGUNDA CONSULTA
            // BUSCAR O CLIMA
            // ========================================

            const urlClima =
                `${CLIMA_URL}?latitude=${latitude}` +
                `&longitude=${longitude}` +
                `&current=temperature_2m` +
                `,relative_humidity_2m` +
                `,wind_speed_10m` +
                `,weather_code`;


            // Faz a segunda requisição
            return fetch(urlClima);

        })


        // ========================================
        // CONVERTE O CLIMA PARA JSON
        // ========================================

        .then(resposta => {

            // Verifica se a API respondeu corretamente
            if (!resposta.ok) {

                throw new Error(
                    "Erro ao buscar o clima."
                );

            }

            return resposta.json();

        })


        // ========================================
        // RECEBE OS DADOS DO CLIMA
        // ========================================

        .then(dadosClima => {

            // Mostra o JSON no Console
            // Isso ajuda a entender o que a API enviou
            console.log(
                "JSON recebido:",
                dadosClima
            );


            // ========================================
            // PEGA OS DADOS DO CLIMA
            // ========================================

            const temperatura =
                dadosClima.current.temperature_2m;

            const umidade =
                dadosClima.current.relative_humidity_2m;

            const vento =
                dadosClima.current.wind_speed_10m;

            const codigoClima =
                dadosClima.current.weather_code;


            // ========================================
            // TRANSFORMA O CÓDIGO EM TEXTO
            // ========================================

            const condicao =
                interpretarClima(codigoClima);


            // ========================================
            // MOSTRA O RESULTADO NA PÁGINA
            // ========================================

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


        // ========================================
        // TRATAMENTO DE ERROS
        // ========================================

        .catch(erro => {

            // Mostra o erro no Console
            console.error(
                "Erro:",
                erro
            );


            // Mostra uma mensagem para o usuário
            resultado.innerHTML = `

                <p>
                    ❌ Não foi possível consultar o clima.
                </p>

                <p>
                    Verifique o nome da cidade
                    e tente novamente.
                </p>

            `;

        });

}


// ============================================
// FUNÇÃO PARA INTERPRETAR O WEATHER CODE
// ============================================

function interpretarClima(codigo) {

    // 0 = céu limpo
    if (codigo === 0) {

        return "Céu limpo";

    }


    // 1, 2 e 3 = parcialmente nublado
    if (codigo >= 1 && codigo <= 3) {

        return "Parcialmente nublado";

    }


    // 51 até 67 = chuva
    if (codigo >= 51 && codigo <= 67) {

        return "Chuva";

    }


    // 71 até 77 = neve
    if (codigo >= 71 && codigo <= 77) {

        return "Neve";

    }


    // 80 até 82 = pancadas de chuva
    if (codigo >= 80 && codigo <= 82) {

        return "Pancadas de chuva";

    }


    // 95 ou maior = tempestade
    if (codigo >= 95) {

        return "Tempestade";

    }


    // Caso o código não esteja
    // em nenhuma das condições acima
    return "Condição desconhecida";

}