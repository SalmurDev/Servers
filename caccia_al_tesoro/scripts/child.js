import axios from 'axios'

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function findPath(key) {
    const url = `https://37b2-2-44-90-143.ngrok-free.app/keys/${key}`
    let res = await axios.get(url)
    console.log(res.data)
    if (res.data.treasure) {
        wait(2000).then(() => {
            console.log('ALERT TREASURE FOUND!');
            console.log(res.data);
            console.log('ALERT TREASURE FOUND!');
        })
    } else {
        let currentChild = res.data.children
        currentChild.forEach(el => {
            wait(200).then(() => {                
            findPath(el.key)
            })
        });
    }
}
findPath('a0b1c2d3e4f5')