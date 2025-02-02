import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import * as students from './studentRoutes.mjs'
const app = express()
app.use(cors());
app.use(bodyParser.json())
const port = 8000

app.get('/', students.welcome)
app.get('/digitazon/2023/02/group/2/students', students.get)
app.get('/digitazon/2023/02/students', students.getAll)
app.put('/digitazon/2023/02/group/:id/students', students.addGroup)
app.delete('/digitazon/2023/02/students/last', students.deleteLast)
app.delete('/digitazon/2023/02/students', students.deleteAll)

app.get('/key', students.key)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })