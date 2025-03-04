import React,{useState} from 'react'

const Mint = ({mintFunc,burnFunc}) => {
    const [mintAmount, setMintAmount] = useState(0);
    const [address, setAddress] = useState("");
    const [burnAmount, setBurnAmount] = useState(0);    
  return (
    <>
    <h1>Minter</h1>
    <div>
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

export default Mint