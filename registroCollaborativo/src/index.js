import express from 'express'
import bodyParser from 'body-parser'
import * as students from './studentRoutes.mjs'
const app = express()
app.use(bodyParser.json())
const port = 3000


app.get('/digitazon/2023/02/group/2/students', students.get)
app.get('/digitazon/2023/02/students', students.getAll)
app.put('/digitazon/2023/02/group/:id/students', students.addGroup)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })