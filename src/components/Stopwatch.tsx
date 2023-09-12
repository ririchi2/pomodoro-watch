import React, { useEffect, useState } from 'react'
import useSound from 'use-sound';
const clickUiSfx = require('../sounds/clickui.mp3');

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [playClickUi] = useSound(clickUiSfx);

  useEffect(() => {

    const interval = setInterval(() => {
      if (running) {
        setTime((prevTime) => prevTime + 10);
      } else if (!running) {
        clearInterval(interval)
      }
    }, 10);

    return () => {
      clearInterval(interval)
    }
  }, [running]);

  function stopwatchTimer(): React.ReactNode {
    return running
      ? <div className="w-auto p-4 my-2 text-6xl font-bold rounded-lg cursor-default bg-gray-100">
        <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
        <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
        <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>
      </div>
      : <div className="w-auto p-4 my-2 text-6xl font-bold rounded-lg cursor-default bg-rusty-red">
        <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
        <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
        <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>
      </div>;
  }

  return (
    <div className="stopwatch">
      {
        stopwatchTimer()
      }
      <div className="buttons">
        <button
          onClick={() => { setRunning(true); playClickUi(); }}
          className='px-4 py-2 mx-2 my-2 text-lg text-gray-500 rounded shadow bg-gray-100 hover:bg-white shadow-pale-silver'
        >Start</button>
        <button
          onClick={() => { setRunning(false); playClickUi() }}
          className='px-4 py-2 mx-2 my-2 text-lg text-gray-500 rounded shadow bg-gray-100 hover:bg-white shadow-pale-silver'
        >Stop</button>
        <button
          onClick={() => { setTime(0); playClickUi() }}
          className='px-4 py-2 mx-2 my-2 text-lg text-gray-500 rounded shadow bg-gray-100 hover:bg-white shadow-pale-silver'
        >Reset</button>
      </div>
    </div>
  );
};

export default Stopwatch
