import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <nav className="py-6 flex flex-row">
            <div className=" ml-auto ">
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
