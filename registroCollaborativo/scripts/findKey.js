import axios from 'axios'

const GROUPS = {
    1: 'https://7758-2001-b07-a9a-89a8-fc69-90ae-c7c4-8dbc.ngrok-free.app/digitazon/2023/02/group/1/students',
    2: 'https://b6a4-37-162-141-71.ngrok-free.app/digitazon/2023/02/group/2/students',
    3: 'https://878f-151-33-19-106.ngrok-free.app/digitazon/2023/02/group/3/students',
    4: 'https://5392-2001-b07-6474-5b1b-a5b5-1e51-cec-c622.ngrok-free.app/digitazon/2023/02/group/4/students'
}

async function findKey() {
    for (let i = 0; i < 10000; i++) {
        let currentKey = i.toString().padStart(4, '0')
        let reqInstance = axios.create({
            headers: {
                key: currentKey
            }
        })
        await reqInstance
            .get(`${GROUPS[1]}`)
            .then(
                async () => {
                    console.log('------------')
                    console.log(currentKey)
                    console.log('-----------')
                }
            ).catch((err) => { console.log(err + ' key: ' + currentKey) })
    }
}
findKey()