import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate()

    const handleClick = (path) => {
        navigate(path)
    }

  return (
    <div>
        <button onClick={()=>handleClick('/')}>home</button>
        <button onClick={()=>handleClick('/about')}>About</button>
        <button onClick={()=>handleClick('/form')}>Form</button>
    </div>
  )
}

export default Navbar