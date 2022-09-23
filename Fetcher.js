const dataMaker = async () => {
    const response = await fetch("http://localhost:3000/api/list")
    const data = await response.json()
    return data
}
console.log(dataMaker)
