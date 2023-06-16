import fs from 'node:fs/promises'
import albums from '../db/albums.json' assert { type: 'json' }

const DB_PATH_ALBUM = './db/albums.json'

let NEXT_ALBUM = Object
    .keys(albums)
    .reduce((biggest, id) => biggest > parseInt(id, 10) ? biggest :
        parseInt(id, 10), 0)

export const welcome = (req, res) => {
    if (req.session.user) res.send(`<h1>Welcome ${req.session.user}</h1>`)
    else res.send('<h1>please log in before starting</h1>')
}

export const getAlbums = (req, res) => {
    let i = 1
    let notDeleted = {}
    while (albums[i]) {
        if (!albums[i].deleted) notDeleted[i] = albums[i]
        i++
    }
    res.send(notDeleted)
}

export const getAlbumsByTag = (req, res) => {
    let i = 1
    let taggedAlbum = {}
    while (albums[i]) {
        if (!albums[i].deleted && albums[i].hashtags.includes(`#${req.params.tag}`)) {
            taggedAlbum[i] = albums[i]
        }
        i++
    }
    res.send(taggedAlbum)
}

export const getPhoto = (req, res) => {
    const idAlbum = req.params.id
    const idPhoto = req.params.i
    if (!albums[idAlbum].deleted && albums[idAlbum].photos[idPhoto]) {
        res.send(albums[idAlbum].photos[idPhoto])
    } else {
        res
            .status(404)
            .send({
                error: true,
                message: 'photo not found'
            })
    }
}

export const getPhotosByTag = (req, res) => {
    const idAlbum = req.params.id
    if (!albums[idAlbum].deleted) {
        res.send(albums[idAlbum].photos.filter((photo) => photo.hashtags.includes(`#${req.params.tag}`)
        ))
    } else {
        res
            .status(404)
            .send({
                error: true,
                message: 'album not found'
            })
    }
}

export const newPhoto = async (req, res) => {
    const idAlbum = req.params.id
    if (albums[idAlbum] && !albums[idAlbum].deleted) {
        const date = new Date();
        let day = String(date.getDate()).padStart(2, '0');
        let month = String(date.getMonth() + 1).padStart(2, "0");
        let year = date.getFullYear();
        let newPhoto = {
            "name": "",
            "hashtags": [],
            ...req.body,
            "creation": `${day}-${month}-${year}`,
            "lastModify": false
        }
        albums[idAlbum].photos.push(newPhoto)
        await fs.writeFile(DB_PATH_ALBUM, JSON.stringify(albums, null, '  '))
        res
            .status(201)
            .send({
                message: 'photo created'
            })
    } else {
        res
            .status(404)
            .send({
                error: true,
                message: 'album not found'
            })
    }
}

export const deletePhoto = async (req, res) => {
    const idAlbum = req.params.id
    const idPhoto = req.params.i
    if (!albums[idAlbum].deleted && albums[idAlbum].photos[idPhoto]) {
        albums[idAlbum].photos.splice(idPhoto, 1)
        await fs.writeFile(DB_PATH_ALBUM, JSON.stringify(albums, null, '  '))
        res.send({
            message: 'photo deleted'
        })
    } else {
        res
            .status(404)
            .send({
                error: true,
                message: 'photo not found'
            })
    }
}

export const editPhoto = async (req, res) => {
    const idAlbum = req.params.id
    const idPhoto = req.params.i
    if (!albums[idAlbum].deleted && albums[idAlbum].photos[idPhoto]) {
        const date = new Date();
        let day = String(date.getDate()).padStart(2, '0');
        let month = String(date.getMonth() + 1).padStart(2, "0");
        let year = date.getFullYear();
        let editedPhoto = {
            ...albums[idAlbum].photos[idPhoto],
            ...req.body,
            "lastModify": `${day}-${month}-${year}`
        }
        albums[idAlbum].lastModify = `${day}-${month}-${year}`
        albums[idAlbum].photos[idPhoto] = editedPhoto
        await fs.writeFile(DB_PATH_ALBUM, JSON.stringify(albums, null, '  '))
        res.send({
            message: 'photo edited'
        })
    } else {
        res
            .status(404)
            .send({
                error: true,
                message: 'photo not found'
            })
    }
}

export const getAlbum = (req, res) => {
    const idAlbum = req.params.id
    if (albums[idAlbum] && !albums[idAlbum].deleted) {
        res.send(albums[idAlbum])
    } else {
        res
            .status(404)
            .send({
                error: true,
                message: 'album not found'
            })
    }
}

export const newAlbum = async (req, res) => {
    NEXT_ALBUM++
    const date = new Date();
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let year = date.getFullYear();
    let album = {
        "name": "",
        "photos": [],
        "hashtags": [],
        ...req.body,
        "creation": `${day}-${month}-${year}`,
        "lastModify": false
    }
    albums[NEXT_ALBUM] = album
    await fs.writeFile(DB_PATH_ALBUM, JSON.stringify(albums, null, '  '))
    res
        .status(201)
        .send({
            message: 'album created'
        })
}

// decido che quando cancello un album lo marco come deleted
// questo perchè, mentre cancellare una singola foto per sbaglio potrebbe non essere un dramma, 
// cancellare per sbaglio un intero album potrebbe essere molto più dannoso

export const deleteAlbum = async (req, res) => {
    const idAlbum = req.params.id
    if (albums[idAlbum] && !albums[idAlbum].deleted) {
        albums[idAlbum].deleted = true
        await fs.writeFile(DB_PATH_ALBUM, JSON.stringify(albums, null, '  '))
        res.send({
            message: 'album deleted'
        })
    } else {
        res
            .status(404)
            .send({
                error: true,
                message: 'album not found'
            })
    }
}

export const editAlbum = async (req, res) => {
    const idAlbum = req.params.id
    if (albums[idAlbum] && !albums[idAlbum].deleted) {
        const date = new Date();
        let day = String(date.getDate()).padStart(2, '0');
        let month = String(date.getMonth() + 1).padStart(2, "0");
        let year = date.getFullYear();
        let editedAlbum = {
            ...albums[idAlbum],
            ...req.body,
            "lastModify": `${day}-${month}-${year}`
        }
        albums[idAlbum] = editedAlbum
        await fs.writeFile(DB_PATH_ALBUM, JSON.stringify(albums, null, '  '))
        res.send({
            message: 'album edited'
        })
    } else {
        res
            .status(404)
            .send({
                error: true,
                message: 'album not found'
            })
    }
}