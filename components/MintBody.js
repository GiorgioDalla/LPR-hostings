import { abi, contractAddresses, addressSignature } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"

export default function MainMint() {
    const { chainId: chainIdHex, isWeb3Enabled, account, Moralis } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const LprAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [currentSupply, getCurrentSupply] = useState("0")
    const dispatch = useNotification()

    function findSignature(address, mintSignature) {
        let data = addressSignature
        for (var i = 0; i < data.length; i++) {
            if (data[i]._id == address) {
                if (mintSignature in data[i]) {
                    return data[i][mintSignature]
                } else {
                    return "No Signature found"
                }
            }
        }
        return "No such address"
    }

    let keyValue = findSignature(account, "mintSignature")
    console.log(keyValue)

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
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

    const {
        runContractFunction: saleMint,
        data: enterTxResponse,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: LprAddress,
        functionName: "saleMint",
        params: { _account: account, signature: keyValue },
    })
    // const { runContractFunction: setUpSale } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: LprAddress,
    //     functionName: "setUpSale()",
    // })

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
    }, [currentSupply])

    return (

        <div className="mt-14 divBox grid h-128 place-items-center justify center border-16 border-red-400 cursor-default">
            {LprAddress && isWeb3Enabled ? (
                <div>
                    <button
                        className="text-2xl border-red-400 bg-white font-sans text-black hover:font-bold py-2 px-4 ml-auto"
                        onClick={async () =>
                            await saleMint({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error), //add it to all my runcontract functions
                            })
                        }
                        disabled={isLoading || isFetching}
                    >
                        {isFetching || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-4 rounded-full"></div>
                        ) : (
                            "Mint"
                        )}
                    </button>
                    {/* <button onClick={async () => await setUpSale()}>setUpSale</button> */}
                </div>
            ) : (
                <div className="text-xl font-sans ">
                    Please connect your wallet to the Ethereum mainnet
                </div>
            )}

            <div className="text-l font-sans ">{currentSupply}/111 minted</div>
        </div>
    )
}
