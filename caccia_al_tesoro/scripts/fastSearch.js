import axios from 'axios'

// avendo molto tempo a disposizione provo a scrivere la funzione più stringata possibile

async function findTreasure(key) {
    let res = await axios.get(`https://37b2-2-44-90-143.ngrok-free.app/keys/${key}`)
    res.data.treasure ? console.log(res.data) : res.data.children.forEach(el => findTreasure(el.key))
}
findTreasure('a0b1c2d3e4f5')