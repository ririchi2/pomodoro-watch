import React, { useState } from 'react'
import { HiLightBulb, HiOutlineLightBulb } from "react-icons/hi";

function ButtonLightbulb() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  function toggleDarkMode() {
    setDarkMode(!darkMode)
  }

  function ifLightBulbs() {
    return darkMode
    ? <HiOutlineLightBulb onClick={() => toggleDarkMode()} />
    : <HiLightBulb onClick={() => toggleDarkMode()} />
  }

  return (
    <div className='m-4'>
      {ifLightBulbs()}
    </div>
  )
}

export default ButtonLightbulb