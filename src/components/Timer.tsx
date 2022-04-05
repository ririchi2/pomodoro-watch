import React, { useEffect, useRef, useState } from 'react'
import useSound from 'use-sound';
// import clickSfx from '../sounds/click.mp3';


function Timer(): JSX.Element {
  const clickSfx = require('../sounds/click.mp3');
  const clickUiSfx = require('../sounds/clickui.mp3');
  const dingSfx = require('../sounds/dingelevator.mp3');

  const workMinutes = 25;
  const breakMinutes = 5;

  const [secondsLeft, setSecondsLeft] = useState(1500); //Inicializamos a 1500 porque 1500segs = 25min
  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState('work');

  //Hay que usar referencias mutables porque no actualiza a cada segundo
  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);

  function switchMode(): void {
    const nextMode = modeRef.current === 'work' ? 'break' : 'work';  //si es 'work' el siguiente es 'break' sino 'work'
    const nextSeconds = (nextMode === 'work' ? workMinutes : breakMinutes) * 60;  //segundos


    setMode(nextMode);
    setSecondsLeft(nextSeconds);
    //Actualizamos referencias
    modeRef.current = nextMode;
    secondsLeftRef.current = nextSeconds
  }

  function tick(): void {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
  }

  function initTimer(): void {
    setSecondsLeft(workMinutes * 60); //Iniciamos en work
  }

  //Cada vez que montamos/actualizamos el componente ejecutamos <-
  //la dependencia/dependemos de isPaused para saber si ejecutamos o no
  useEffect(() => {
    initTimer();

    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }

      if (secondsLeftRef.current === 0) {
        playDingSfx();
        return switchMode();
      }

      tick();
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  }, [isPaused]);

  //minutos y segundos
  const minutes = Math.floor(secondsLeftRef.current / 60);
  let seconds = secondsLeftRef.current % 60;
  let secondsString = `${seconds}`;
  if (seconds < 10) secondsString = '0' + seconds; // 25:0 => 25:00

  //esto es una mickeyherramienta para mas tarde
  // const totalSeconds = mode === 'work'
  //   ? workMinutes * 60
  //   : breakMinutes * 60;
  // const percentage = Math.round(secondsLeftRef.current / totalSeconds) * 100;

  //hook sounds
  const [playClickSfx] = useSound(clickSfx);
  const [playClickUi] = useSound(clickUiSfx);
  const [playDingSfx] = useSound(dingSfx);

  return (
    <div className='flex flex-col items-center w-11/12 max-w-screen-sm py-2 my-2 font-mono text-center bg-green-500 border border-transparent rounded shadow-orange-500/50'>
      <div className='px-8 py-2 my-2 text-xl font-bold rounded shadow-lg cursor-default bg-slate-200/50'>{mode}</div>
      {
        isPaused
          ? <div className='w-1/3 py-2 my-2 text-6xl font-bold bg-red-500 rounded-lg cursor-default'>{minutes + ':' + secondsString}</div>
          : <div className='w-1/3 py-2 my-2 text-6xl font-bold rounded-lg cursor-default bg-slate-200/50'>{minutes + ':' + secondsString}</div>

      }
      <div>
        {isPaused
          ? <button
            onClick={() => { setIsPaused(false); isPausedRef.current = false; playClickUi(); }}
            className="px-8 py-2 my-2 text-lg font-bold bg-green-700 rounded shadow-lg hover:bg-emerald-700 hover:shadow-emerald-500/40 shadow-emerald-500/50"
          >Play</button>
          : <button
            onClick={() => { setIsPaused(true); isPausedRef.current = true; playClickUi(); }}
            className="px-8 py-2 my-2 text-lg font-bold bg-green-700 rounded shadow-lg hover:bg-emerald-700 hover:shadow-emerald-500/40 shadow-emerald-500/50"
          >Pause</button>
        }
      </div>
      <div>
        {
          mode === 'work'
            ? <button
              onClick={() => { switchMode(); playClickSfx(); }}
              className="px-8 py-2 my-2 text-lg font-bold bg-green-700 rounded shadow-lg hover:bg-emerald-700 hover:shadow-emerald-500/40 shadow-emerald-500/50">Break</button>
            : <button
              onClick={() => { switchMode(); playClickSfx(); }}
              className="px-8 py-2 my-2 text-lg font-bold bg-green-700 rounded shadow-lg hover:bg-emerald-700 hover:shadow-emerald-500/40 shadow-emerald-500/50">Work</button>
        }
      </div>
    </div>

  )
}

export default Timer