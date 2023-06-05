import fs from 'node:fs/promises'
import users from '../db/users.json' assert { type: 'json' }
import todoUsers from '../db/todos-users.json' assert { type: 'json' }
import passwords from '../db/passwords.json' assert { type: 'json'}
import axios from 'axios'

const DB_PATH = './db/users.json'
const DB_PATH_TODOS_USERS = './db/todos-users.json'
const DB_PATH_PASSWORDS = './db/passwords.json'

let NEXT_USER = Object
  .keys(passwords)
  .reduce((biggest, id) => biggest > parseInt(id, 10) ? biggest :
    parseInt(id, 10), 0)

export const register = async (req, res) => {
  console.log(req.body);
  if (!(req.body.name && req.body.password)) {
    res
      .status(400)
      .send({
        error: true,
        message: 'name or password not found'
      })
    return
  }
  let findUser = false
  Object.entries(passwords).forEach((el) => {
    console.log(el[1].name)
    if (el[1].name == req.body.name) findUser = true
  })
  if(findUser == true){
    res
      .status(409)
      .send({
        error: true,
        message: 'username already taken'
      })
    return
  }
  NEXT_USER++
  passwords[NEXT_USER] = req.body
  await fs.writeFile(DB_PATH_PASSWORDS, JSON.stringify(passwords, null, '  '))
  res
    .status(201)
    .send({
      message: 'user and password created'
    })
}

export const login = async (req, res) => {
  for (let i = 1; i <= NEXT_USER; i++) {
    if (req.body.name == passwords[i].name && req.body.password == passwords[i].password) {
      req.session.user = req.query.name;
      req.session.logged = true;
      res
        .status(200)
        .send({
          message: 'you are now logged in'
        })
      return
    }
  }
  res
    .status(401)
    .send({
      error: true,
      message: 'wrong username or password'
    })
}

export const sessions = async (req, res) => {
  console.log(req.session.cookie);
  if (req.session.logged) {
    let user = passwords[req.query.id]
    res.send({ data: user })
    return
  }
  res
    .status(401)
    .send({
      error: true,
      message: 'not logged in'
    })
}

let NEXT = Object
  .keys(users)
  .reduce((biggest, id) => biggest > id ? biggest : id, 0)


export const create = async (req, res) => {
  NEXT++
  users[NEXT] = req.body

  // never use sync, go the async way
  // fs.writeFileSync(DB_PATH, JSON.stringify(users, null, '  '))

  await fs.writeFile(DB_PATH, JSON.stringify(users, null, '  '))
  res
    .status(201)
    .send({
      message: 'user created'
    })
}

export const postFake = async (req, res) => {
  NEXT++
  await axios.get(`https://fakestoreapi.com/users/${req.params.id}`).then(
    (response) => users[NEXT] = {
      ...req.body, ...response.data
    }).catch(
      () => users[NEXT] = {
        ...req.body
      })
  await fs.writeFile(DB_PATH, JSON.stringify(users, null, '  '))
  res.status(201).send({
    message: 'user created'
  })
}

export const get = (req, res) => {
  let user = users[req.params.id]
  if (user && !user.deleted) {
    res.send({ data: user })
  } else {
    res
      .status(200)
      .send({
        data: {},
        error: true,
        message: 'user not found'
      })
  }
}

export const getAll = (req, res) => {
  res.send(Object.entries(users).filter((el) => (!el[1].deleted)))
}

export const search = (req, res) => {
  const query = req.query
  let filtered = Object.values(users)
    .filter(u => u.name === query.name || u.surname === query.surname)
  res.send(filtered)
}

export const update = async (req, res) => {
  if (req.headers.token != 'secret') {
    res
      .status(401)
      .send({
        data: {},
        error: true,
        message: 'token not found'
      })
    return
  }
  let user = users[req.params.id]
  console.log(req.body)
  if (user) {
    let newUser = { ...user, ...req.body }
    users[req.params.id] = newUser
    await fs.writeFile(DB_PATH, JSON.stringify(users, null, '  '))
    res.send(newUser)
  } else {
    res
      .status(200)
      .send({
        data: {},
        error: true,
        message: 'user not found'
      })
  }
}

export const remove = async (req, res) => {
  if (req.headers.token != 'secret') {
    res
      .status(401)
      .send({
        data: {},
        error: true,
        message: 'token not found'
      })
    return
  }
  let user = users[req.params.id]
  if (user) {
    let newUser = { ...user, deleted: true }
    users[req.params.id] = newUser
    await fs.writeFile(DB_PATH, JSON.stringify(users, null, '  '))

    // make sure we delete any todos-users
    // related to this user
    Object.keys(todoUsers).forEach(idut => {
      let split = idut.split('-')
      if (split[0] == req.params.id) {
        delete todoUsers[idut]
      }
    })
    await fs.writeFile(DB_PATH_TODOS_USERS, JSON.stringify(todoUsers, null, '  '))

    await fs.writeFile(DB_PATH, JSON.stringify(users, null, '  '))
    res.status(200).end()
  } else {
    res
      .status(200)
      .send({
        data: {},
        error: true,
        message: 'user not found'
      })
  }
}

