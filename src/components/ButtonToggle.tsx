import React from 'react'

function ButtonToggle() {
  return (
    <div className="flex items-center justify-center w-full my-12">
      <label
        htmlFor="toogleA"
        className="flex items-center cursor-pointer"
      >
        <div className="relative">
          <input id="toogleA" type="checkbox" className="sr-only" />
          <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
          <div className="absolute w-6 h-6 transition bg-white rounded-full shadow dot -left-1 -top-1"></div>
        </div>
      </label>
    </div>
  )
}

export default ButtonToggle