//BTCBUSD

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
    const axios = require("axios");
    const resposta = await axios.get("https://api.binance.com/api/v3/klines?symbol=BTCBUSD&interval=1m");
    const fechamento = resposta.data.map(vela => parseFloat(vela[4]));
    const rsi = calcRSI(fechamento);
    
    
    console.log("Preço: " + fechamento[499] + " RSI: "+rsi); 
    
    if (rsi > 70 && iscomprado){
        console.log("*-*Vendi a " + fechamento[499] + "com RSI a "+ rsi);
        iscomprado = false;
    }
    else if (rsi < 30 && !iscomprado){
            console.log("*-*Comprei a " + fechamento[499] + "com RSI a "+ rsi);
            iscomprado = true;
    }
    

}

setInterval(processo, 1000)

processo();