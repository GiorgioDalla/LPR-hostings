import { abi, contractAddresses } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"

export default function MainMint() {
    const { chainId: chainIdHex, isWeb3Enabled, account, Moralis } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const LprAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [currentSupply, getCurrentSupply] = useState("0")
    const dispatch = useNotification()

    console.log(account)
    // console.log(AddressAndSignatures)


    let keyPass = getSignatureByAddress(account)
    console.log(keyPass)

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
