const fetch = require("node-fetch")
const url = "http://localhost:3000/api/list"

const getData = async (url) => {
    try {
        const response = await fetch(url)
        const json = await response.json()
        console.log(json)
    } catch (error) {
        console.log(error)
    }
}

getData(url)

module.exports = { getData }
