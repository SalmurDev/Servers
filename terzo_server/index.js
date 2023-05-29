import express from 'express'
import bodyParser from 'body-parser'
import {
  games,
  gameId,
  gameSearch,
  gameYear,
  gameRating,
  gameDelete,
  newGame,
  modGame
} from './gameRoutes.mjs'
const app = express()
const port = 3000
app.use(bodyParser.json())

app.get('/', (req, res) => {  
  res.send('Welcome to BoardGameDatabase')
})

'/boardgames?type=strategy'

app.get('/boardgames', games)
app.get('/boardgames/:id', gameId)
app.get('/boardgames/search/:searchBy/:name', gameSearch)
app.get('/boardgames/year/:year', gameYear)
app.get('/boardgames/ratings/:rating', gameRating)
app.delete('/boardgames/:id', gameDelete)
app.post('/boardgames', newGame)
app.put('/boardgames/:id', modGame)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})