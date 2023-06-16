import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import * as photos from './photosRoutes.mjs'
import * as users from './userRoutes.mjs'
const app = express()
const port = 8000

app.use(bodyParser.json())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }
}))

function sessionChecked(req, res, next) {
    if (req.session.user) {
        next()
    } else {
        res
            .status(403)
            .send({
                message: 'not authorized'
            })
    }
}

app.get('/', photos.welcome)
app.get('/albums', sessionChecked, photos.getAlbums)
app.get('/albums/tags/:tag', sessionChecked,photos.getAlbumsByTag)

app.get('/albums/:id/:i', sessionChecked, photos.getPhoto)
app.get('/albums/:id/tags/:tag', sessionChecked,photos.getPhotosByTag)
app.post('/albums/:id', sessionChecked, photos.newPhoto)
app.delete('/albums/:id/:i', sessionChecked, photos.deletePhoto)
app.put('/albums/:id/:i', sessionChecked, photos.editPhoto)

app.get('/albums/:id', sessionChecked, photos.getAlbum)
app.post('/albums', sessionChecked, photos.newAlbum)
app.delete('/albums/:id', sessionChecked, photos.deleteAlbum)
app.put('/albums/:id', sessionChecked, photos.editAlbum)

app.post('/register', users.register)
app.post('/login', users.login)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})