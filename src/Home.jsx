import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()

    const handleForm1Click = () => {
        navigate('/form')
    }

    const handleForm2Click = () => {
        navigate('/form2')
    }

  return (
    <div>
        <button onClick={handleForm1Click}>Form 1</button>
        <button onClick={handleForm2Click}>Form 2</button>
    </div>
  )
}

export default Home