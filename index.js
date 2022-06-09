//BTCBUSD
const axios = require("axios");
const api = require("imersao-bot-cripto-api");
const credenciais = {
    apiKey: "rF97FjodPK6M3kueAWxY6x9Ce93WgBGxo6T0baPkuJGQtKKQchqqbrwxW9jAPLlM",
    apiSecret: "HUHwd5oG934InZOzQcwVqxL8kFH0g8z3P8Biad4ji5CBeIIG3GT25lnHYtrJ0h1g",
    test:true
}
function calcRSI(fechamento){
    let ganhos = 0;
    let perdas = 0;

    for (let i = fechamento.length - 14; i < fechamento.length; i++){
        const diferenca = fechamento[i] - fechamento[i-1];
        if (diferenca >=0)
            ganhos += diferenca;
        else
            perdas -= diferenca;
    }

    const forca = ganhos / perdas;
    return 100 - (100 / (1 + forca));
}

let iscomprado = false;

async function processo(){
    const symbol = "BTCBUSD";
    const quantidade = 0.001;

    const resposta = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m`);
    const fechamento = resposta.data.map(vela => parseFloat(vela[4]));
    const rsi = calcRSI(fechamento);
    
    
    console.log("Preço: " + fechamento[499] + " RSI: "+rsi); 
    
    if (rsi > 70 && iscomprado){
        console.log("*-*Vendi a " + fechamento[499] + "com RSI a "+ rsi);
        const resultVenda = await api.sell(credenciais, symbol, quantidade);
        console.log(resultVenda);
        iscomprado = false;
    }
    else if (rsi < 30 && !iscomprado){
            console.log("*-*Comprei a " + fechamento[499] + "com RSI a "+ rsi);
            const resultCompra = await api.buy(credenciais, symbol, quantidade);
            console.log(resultCompra);
            iscomprado = true;
    }
    

}

setInterval(processo, 1000)

processo();