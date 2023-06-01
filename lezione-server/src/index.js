import express from 'express'
import session from 'express-session'
const app = express()
const port = 3000
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

import bodyParser from 'body-parser'
app.use(bodyParser.json())


import * as user from './user-routes.mjs'
import * as todo from './todo-routes.mjs'
import * as todoUser from './routes-user-todo.mjs'

app.post('/users/register', user.register)
app.post('/users/login', user.login)
app.get('/users/session', user.sessions)

app.get('/users', user.getAll)
app.get('/users/search', user.search)
app.get('/users/:id', user.get)
app.put('/users/:id', user.update)
app.delete('/users/:id', user.remove)
app.post('/users', user.create)

app.post('/users/fake/:id', user.postFake)

app.get('/todos', todo.getAll)
app.get('/todos/search', todo.search)
app.get('/todos/:id', todo.get)
app.put('/todos/:id', todo.update)
app.delete('/todos/:id', todo.remove)
app.post('/todos', todo.create)

app.post('/users/:idu/todos/:idt', todoUser.create)
app.delete('/users/:idu/todos/:idt', todoUser.remove)
app.put('/users/:idu/todos/:idt/completed', todoUser.completed)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Partendo dal server che abbia almeno le rotte dell'utente:
// * quando viene creato un utente tramite POST si deve fare una GET a questo indirizzo https://fakestoreapi.com/users/1, 
// utilizzando l'id corretto, e completare tutti i campi dell'oggetto utente con cio' che si trova nella risposta dell'API.
// Se l'utente con quell'id non c'e' nelle fakestoreapi semplicemente lo lasciate con i dati che ha POSTato l'utente, 
// quindi per come abbiamo visto fino ad ora solo con name e username
//  * proteggere le chiamate PUT e DELETE con un token che va specificato negli header, questo token deve contenere un "segreto" che e' specificato nel server, non vi preoccupate di criptare/crittografare/etc niente di tutto cio'.
//  Questo e' il solito esempio di task di esplorazione della teoria. Quindi il token deve essere controllato nel server: controllarlo vuol dire verificare che nel server sia uguale a quanto specificato nel client.