import React from 'react';
import Navbar from './components/Navbar';
import Timer from './components/Timer';

function App() {
  return (
    <div className="flex flex-col items-center h-screen overflow-hidden bg-green-600">
      <Navbar />
      <Timer />
    </div>
  );
}

export default App;
