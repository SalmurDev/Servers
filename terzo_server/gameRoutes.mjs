import boardGames from "./db/boardgames.json" assert { type: 'json' }


export function games(req, res) {
    res.send(boardGames)
}
export function gameSearch(req, res) {
    res.send(boardGames.filter((game) => game[req.params.searchBy].includes(req.params.name)))
}
export function gameId(req, res) {
    res.send(boardGames.filter((game) => game.id == req.params.id))
}
export function gameYear(req, res) {
    res.send(boardGames.filter((game) => game.year == req.params.year))
}
export function gameRating(req, res) {
    res.send(boardGames.filter((game) => game.rating >= req.params.rating))
}
export function gameDelete(req, res) {
    for (let i = 0; i < boardGames.length; i++) {
        if (req.params.id == boardGames[i].id) {
            boardGames.splice(i, 1)
            res.status(200).end()
            return
        }
    }
    res.status(404).end()
}
let CurrentId = 0
function getCurrentId() {
    for (let i = 0; i < boardGames.length; i++) {
        if (boardGames[i].id > CurrentId) CurrentId = boardGames[i].id
    }
}
export function newGame(req, res) {
    getCurrentId()
    CurrentId++
    if (req.body) {
        boardGames.push({id: CurrentId, ...req.body })
        res.status(200).end()
    } else res.status(400).end()
}
export function modGame(req,res){
    for (let i = 0; i < boardGames.length; i++) {
        if (req.params.id == boardGames[i].id) {
            boardGames[i] = { ...boardGames[i], ...req.body }
            res.status(200).end()
            return
        }
    }
    res.status(404).end()
}