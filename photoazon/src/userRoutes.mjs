import fs from 'node:fs/promises'
import users from '../db/users.json' assert { type: 'json' }

const DB_PATH_USERS = './db/users.json'

export const register = async (req,res) => {    
    if(!users[req.body.username] && req.body.username){
        users[req.body.username] = req.body.password         
        await fs.writeFile(DB_PATH_USERS, JSON.stringify(users, null, '  '))
        res.send({
            message: 'user created'
        })
    }else{
        res
        .status(400)
        .send({
            message: 'invalid username'
        })
    }
}

export const login = (req,res) => {    
    if(users[req.body.username] == req.body.password){    
        req.session.user = req.body.username 
        res.redirect('/')
    }else{
        res
        .status(400)
        .send({
            message: 'wrong username or password'
        })
    }
}