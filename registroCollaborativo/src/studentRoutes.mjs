import fs from 'node:fs/promises'
import studentsGroup2 from '../db/studentsGroup2.json' assert { type: 'json' }
import students from '../db/students.json' assert { type: 'json' }
import axios from 'axios'

const DB_PATH_ALL = './db/students.json'

const GROUPS = {
    1: 'https://5e81-2001-b07-a9a-89a8-fc69-90ae-c7c4-8dbc.ngrok-free.app/digitazon/2023/02/group/1/students',
    2: 'http://localhost:3000/digitazon/2023/02/group/2/students',
    3: 'https://878f-151-33-19-106.ngrok-free.app/digitazon/2023/02/group/3/students',
    4: 'https://5392-2001-b07-6474-5b1b-a5b5-1e51-cec-c622.ngrok-free.app/digitazon/2023/02/group/4/students'
}

export const welcome = (req, res) => {
    res.send('<h1>Welcome to group 2</h1>')
}

export const get = async (req, res) => {
    if(req.headers.key == '0876'){
        await res.status(200).send(studentsGroup2)
        return
    }
    await res
    .status(404)
    .send({
        error: true,
        message: 'ritenta, sarai più fortunato'
    })
}
export const getAll = (req, res) => {
    res.send(students)
}

export const addGroup = async (req, res) => {
    const group = await axios.get(`${GROUPS[req.params.id]}`)
    if (Array.isArray(group.data)) {
        for (let i = 0; i < group.data.length; i++) {
            students.push(group.data[i])
        }
        await fs.writeFile(DB_PATH_ALL, JSON.stringify(students, null, '  '))
        res.status(200).send({ message: 'group added' })
        return
    }
    res.status(404).send({ 
        error: true,
        message: 'ritenta, sarai più fortunato'
    })
}

export const deleteLast = async (req, res) => {
    students.pop()
    await fs.writeFile(DB_PATH_ALL, JSON.stringify(students, null, '  '))
    res.status(200).send({ message: 'student deleted' })
}

export const deleteAll = async (req, res) => {
    let currentLength = students.length
    for (let i = 0; i < currentLength; i++) {
        students.pop()
    }
    await fs.writeFile(DB_PATH_ALL, JSON.stringify(students, null, '  '))
    res.status(200).send({ message: 'students deleted' })
}

export const key = (req, res) => {
    res.status(200).send({
        key: `${req.headers.key}`
    })
}