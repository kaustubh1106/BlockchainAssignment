import React,{useState} from 'react'

const User = ({burnFunc}) => {
    const [burnamount, setBurnamount] = useState(0);
  return (
    <>
    <h1>User</h1>
    <div>
      <input 
        type="number"
        onChange={(e) => setBurnamount(e.target.value)}
        />
        <button disabled={burnamount==0} onClick={()=>burnFunc(burnamount)}>burn</button>
    </div>
    </>
    
  )
}

export default User