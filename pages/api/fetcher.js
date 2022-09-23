let account = "0x617F2E2fD72FD9D5503197092aC168c91465E7f2"

async function getSignatureByAddress(account) {
    const response = await fetch("http://localhost:3000/api/list")
    const data = await response.json()
    for (var i = 0; i < data.length; i++) {
        if (data[i]._id == account) {
            return data[i]["mintSignature"] || "no signature"
        }
    }
    return "No such address"
}
let keyPass = getSignatureByAddress(account)

console.log(keyPass)
