async function dataMaker() {
    const response = await fetch("http://localhost:3000/api/list")
    const data = await response.json()
    console.log(data)
}
dataMaker()
