import React from 'react';
import Navbar from './components/Navbar';
import Timer from './components/Timer';

function App() {
  return (
    <div className="flex flex-col items-center h-screen overflow-hidden bg-green-600">
      <Navbar />
      <div className='text-3xl font-bold underline'>
        Pomodoro
      </div>
      <Timer />
    </div>
  );
}

export default App;
