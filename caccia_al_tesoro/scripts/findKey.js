import axios from 'axios'

// primo tentativo che cerca la cosa sbagliata

function findChildKey(k, n) {
    let child = ''
    let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    for (let i = 0; i < k.length; i++) {
        if (numbers.includes(k.charAt(i))) {
            let current = parseInt(k.charAt(i), 10)
            if (current < (10 - n)) {
                child += current + n
            } else {
                child += current - (10 - n)
            }
        }
        if (letters.includes(k.charAt(i))) {
            let index = letters.indexOf(k.charAt(i))
            if (index < (26 - n)) {
                child += letters[index + n]
            } else {
                child += letters[index - (26 - n)]
            }
        }
    }
    return child
}

async function findTreasureWithKey() {
    const url = 'https://37b2-2-44-90-143.ngrok-free.app/root'
    let res = await axios.get(url, {
        headers: {
            name: 'Filippo Bortolotto',
            key: 'a0b1c2d3e4f5',
            children: [
                {
                    key: 'g6h7i8j9k0l1',
                    children: [
                        { key: findChildKey('g6h7i8j9k0l1', 6) },
                        { key: findChildKey('g6h7i8j9k0l1', 14) }
                    ]
                },
                {
                    key: 'o4p5q6r7s8t9',
                    children: [
                        { key: findChildKey('o4p5q6r7s8t9', 6) },
                        { key: findChildKey('o4p5q6r7s8t9', 14) }
                    ]
                }
            ]
        }
    })
    console.log(res.status, res.data)    
}
findTreasureWithKey()