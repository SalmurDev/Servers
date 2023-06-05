import fs from 'node:fs/promises'
import studentsGroup2 from '../db/studentsGroup2.json' assert { type: 'json' }
import students from '../db/students.json' assert { type: 'json' }
import axios from 'axios'

const DB_PATH = './db/studentsGroup2.json'
const DB_PATH_ALL = './db/students.json'

let NEXT_ID = Object
    .keys(students)
    .reduce((biggest, id) => biggest > id ? biggest : id, 0)

export const get = (req, res) => {
    res.send(students)
}
export const getAll = (req, res) => {
    res.send(studentsGroup2)
}

export const addGroup = async (req, res) => {
    const group = await axios.get(`http://localhost:3000/digitazon/2023/02/group/${req.params.id}/students`)
    console.log(Object.keys(group.data).length);
    for (let i = 1; i <= Object.keys(group.data).length; i++) {
        console.log(group.data[i]);
        NEXT_ID++
        students[NEXT_ID] = group.data[i]
    }
    await fs.writeFile(DB_PATH_ALL, JSON.stringify(students, null, '  '))
    res.status(200).send({ message: 'group added' })
}