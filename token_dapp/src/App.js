import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Admin from "./component/Admin.jsx";
import User from "./component/User.jsx";
import Mint from "./component/Mint.jsx";
import TokenABI from "./CustomTokenABI.json";

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

const App = () => {
    const [account, setAccount] = useState(null);
    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState(0);
    const [role, setRole] = useState(null);
    const [contract, setContract] = useState(null);
    const [balance, setBalance] = useState(0);
    const [balanceFetched, setBalanceFetched] = useState(false);
    useEffect(() => {
        connectWallet();
    }, []);
    useEffect(() => {
        if (contract && account&& !balanceFetched) {
            getBalance(account);
            setBalanceFetched(true);
            getRole(account);
        }
    }, [contract]);

    const connectWallet = async () => {
        if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner();
            const accounts = await signer.getAddress()
            const _contract = new ethers.Contract(CONTRACT_ADDRESS, TokenABI, signer);

            setAccount(accounts);
            setContract(_contract);
           
           
            // listenToEvents(contract);
        } else {
            toast.error("Please install MetaMask!!!");
        }
    };

    const getBalance = async (userAddress) => {
        if (contract) {
            const balance = await contract.balanceOf(userAddress);
            console.log("Balance: ", balance);
            setBalance(ethers.formatEther(balance));
        }
    };
    const getRole = async (userAddress) => {
        if (contract) {
            const role = await contract.getUserRole(userAddress);
            console.log("Role: ", role);
            setRole(parseInt(role));
        }
    }
    const mint = async (_account,amount) => {
        if (contract) {
            const tx = await contract.mint(_account, amount);
            await tx.wait();
            toast.success(`mint ${amount} tokens to ${_account}`);
        }
    }
    const burn = async (amount) => {
        if (contract) {
            const tx = await contract.burn(amount);
            await tx.wait();
            toast.success(`burnt ${amount} tokens`);
        }
    }
    const transferTokens = async (to, amount) => {
        try {
            const tx = await contract.transfer(to, ethers.parseEther(amount));
            await tx.wait();
            toast.success(`Transferred ${amount} tokens to ${to}`);
            getBalance(account);
        } catch (error) {
            toast.error("Transaction failed!");
        }
    };

    const claimAirdrop = async () => {
        try {
            const tx = await contract.claimAirdrop();
            await tx.wait();
            toast.success("Airdrop claimed!");
            getBalance(account);
        } catch (error) {
            toast.error("Airdrop already claimed or falied!");
        }
    };



    return (
        <div className="app">
            <ToastContainer />
            <h2>My ERC-20 dApp</h2>
            {account ? (
                <>
                    <p>Connected Account: {account}</p>
                    <p>Balance: {balance} Tokens</p>
                    {
                        role === 2 ?<> <p>Admin</p> <Admin contract={contract} mintFunc ={mint} burnFunc={burn}/> </>: role === 1 ? <p>You can Mint <Mint mintFunc ={mint} burnFunc={burn}/></p> : <p> <User burnFunc={burn}/></p>
                    }
                    <button onClick={claimAirdrop}>Claim Airdrop</button>
                    <br/>
                    <input onChange={(e)=>{
                        setAddress(e.target.value)
                    }}/> <br/>
                     <input onChange={(e)=>{
                        setAmount(e.target.value)
                    }}/>
                    
                    <button disabled={address === "" || amount === 0}  onClick={() => transferTokens(address, amount)}>
                        Send
                    </button>
                </>
            ) : (
                <button onClick={connectWallet}>Connect MetaMask</button>
            )}
        </div>
    );
};

export default App;
