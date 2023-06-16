import axios from 'axios'

// secondo tentativo con funzione ricorsiva
// utilizzo una funzione wait per non fare tutte le chiamate subito
// tengo traccia del numero di tentativi e della profondità dell'albero
// utilizzo una variabile per impedire che faccia chiamate dopo aver trovato ciò che cerca

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let callCount = 0
let found = false

async function findPath(key, currentDepth) {
    const url = `https://37b2-2-44-90-143.ngrok-free.app/keys/${key}`
    let res = await axios.get(url)
    callCount++
    console.log(res.data)    
    console.log(`call number: ${callCount}, current depth: ${currentDepth}`)
    if (res.data.treasure) {
        found = true
        const treasureCall = callCount
        wait(Math.pow(2, currentDepth) * 200).then(() => {
            console.log('--- ALERT TREASURE FOUND! ---');
            console.log(res.data);
            console.log(`call number: ${treasureCall}, depth: ${currentDepth}`);
        })
    } else {
        let currentChild = res.data.children
        currentChild.forEach(el => {
            wait(Math.pow(2, currentDepth) * 100).then(async () => {
                if (!found) {
                    await findPath(el.key, currentDepth + 1)
                }
            })
        })
    }
}

findPath('a0b1c2d3e4f5', 1)