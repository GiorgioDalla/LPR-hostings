import { abi, contractAddresses } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { data } from "autoprefixer"

export default function MainMint() {
    const { chainId: chainIdHex, isWeb3Enabled, account, Moralis } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const LprAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [currentSupply, getCurrentSupply] = useState("0")
    const dispatch = useNotification()

    console.log(account)

    let keyPass
    let displayData

    async function pullData() {
        // const response = await fetch("http://localhost:3000/api/list")
        const responseData = [
            {
                _id: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                mintSignature:
                    "0xf928250a218ce40664e91b7a15d71bbe2e2e7e909006e5df7e75a39fcb8caa166b08b09668e2070752d27329a656582a70839de1b846494a9b186a6623aae4ba1b",
            },
            {
                _id: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
                mintSignature:
                    "0xec6fe39b5edb5700b6f62aed00d7435d3c0e4924089f77cc39dec63b40724741191969b63727c8c0e2874525402cc00aa5609b94e976b56110e25038c6c2a5a41b",
            },
            {
                _id: "0x17F6AD8Ef982297579C203069C1DbfFE4348c372",
                mintSignature:
                    "0x0d86b284143a68635dad3e32059143ad78fec114ff20160d49d547b4c55d4223270127b212f5fffed0aa081065c868417f40b5fafb60c4602c7415bdcba3dc3f1b",
            },
            {
                _id: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
                mintSignature:
                    "0x9c21e5219197dddb7ca24617ddba012b2b715af5997883643030a95a95803efc0a5a19382a47dec18d87446cfb2ec80ce690e3e355dbab74f7cc87191a0a8c0c1b",
            },
            {
                _id: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
                mintSignature:
                    "0x19ba45ee8546f6bf5305b87cc64688d091f12d8105604e376456404a3330220049c330b750aeb571ae22f1811c5cbc72760b74aa3c7e5d5d97182861e25d2ffc1b",
            },
        ]
        Object.keys(responseData)
            .filter((key) => key.includes("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"))
            .reduce((cur, key) => {
                return Object.assign(cur, { [key]: responseData[key] })
            }, {})
    }

    const fetchedData = pullData()
    console.log(fetchedData)

    // function findSignature() {
    //     let address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    //     let data = pullData()
    //     for (var i = 0; i < data.length; i++) {
    //         if (data[i]._id == address) {
    //             return data[i]["mintSignature"]
    //         }
    //     }
    //     return ":("
    // }
    // let keyValue = findSignature()

    // console.log(keyValue)

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Mint Complete !",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const { runContractFunction: saleMint } = useWeb3Contract({
        abi: abi,
        contractAddress: LprAddress,
        functionName: "saleMint",
        params: { _account: account, signature: keyPass },
    })
    const { runContractFunction: setUpSale } = useWeb3Contract({
        abi: abi,
        contractAddress: LprAddress,
        functionName: "setUpSale()",
    })

    const { runContractFunction: getTotalSupply } = useWeb3Contract({
        abi: abi,
        contractAddress: LprAddress,
        functionName: "totalSupply",
        params: {},
    })

    async function updateUI() {
        const currentSupplyFromCall = (await getTotalSupply()).toString()
        getCurrentSupply(currentSupplyFromCall)
        console.log(currentSupply)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [])

    return (
        <div className="border-8 border-rose-600">
            {LprAddress && isWeb3Enabled ? (
                <div>
                    <button
                        onClick={async () =>
                            await saleMint({
                                // onComplete:
                                // onError:
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error), //add it to all my runcontract functions
                            })
                        }
                    >
                        Mint
                    </button>
                    <button onClick={async () => await setUpSale()}>setUpSale</button>
                </div>
            ) : (
                <div>Please connect your wallet to the Ethereum mainnet</div>
            )}
            {currentSupply}/111
        </div>
    )
}
