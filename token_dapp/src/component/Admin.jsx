import React,{ useEffect, useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Admin = ({contract,mintFunc, burnFunc}) => {
    const [mintAmount, setMintAmount] = useState(0);
        const [address, setAddress] = useState("");
        const [mintAddress, setMintAddress] = useState("");
        const [burnAddress, setBurnAddress] = useState("");
        const [burnAmount, setBurnAmount] = useState(0);    
    const grantMinter = async (address) => {
        if (contract) {
            const role = await contract.getUserRole(address);
            if(role==1){
                toast.success(`Already a minter`);
            }else{
                const tx = await contract.grantMinterRole(address);
                await tx.wait();
                toast.success(`${address} assigned as minter`);
            }
        }
    }
    const revokeMinter = async (address) => {
        if (contract) {
            const role = await contract.getUserRole(address);
            if(role==0){
                toast.success(`Not a minter`);
            }
            else{
                const tx = await contract.revokeMinterRole(address);
                await tx.wait();
                toast.success(`${address} revoked as minter`);
            }
        }
    }
    
  return (
    <>
    <h1>Admin</h1>
    <div>
        <input onChange={(e)=>{
            setMintAddress(e.target.value)
        }}/>
        <button disabled={mintAddress==""} onClick={()=>{
            grantMinter(mintAddress)
        }}>assign Minter</button><br/>
        <input onChange={(e)=>{
            setBurnAddress(e.target.value)
        }}/>
        <button  disabled={burnAddress==""} onClick={()=>{
            revokeMinter(burnAddress)
        }}>revoke Minter</button><br/>
        {/* mint and burn */}

        <input onChange={(e)=>{
            setAddress(e.target.value)
        }}/><br/>
        <input onChange={(e)=>{
            setMintAmount(e.target.value)
        }}/>
        <button disabled={mintAmount==0 || address==""} onClick={()=>{
            mintFunc(address,mintAmount)
        }}>mint</button>
        <input onChange={(e)=>{
            setBurnAmount(e.target.value)
        }}/>
        <button disabled={burnAmount==0} onClick={()=>{
            burnFunc(burnAmount)
        }}>burn</button>
    
    </div>
    </>
  )
}

export default Admin