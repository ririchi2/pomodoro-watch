import React, { useEffect, useRef, useState } from 'react'
import useSound from 'use-sound';
import Stopwatch from './Stopwatch';
const clickSfx = require('../sounds/click.mp3');
const clickUiSfx = require('../sounds/clickui.mp3');
const dingSfx = require('../sounds/dingelevator.mp3');


function Timer(): JSX.Element {
  const WorkMinutes = 25;
  const BreakMinutes = 5;

  const [secondsLeft, setSecondsLeft] = useState(1500); //Inicializamos a 1500 porque 1500segs = 25min
  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState('Work');
  const [watch, setWatch] = useState('pomo');

  //Hay que usar referencias mutables porque no actualiza a cada segundo
  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);
  const watchRef = useRef(watch);

  //minutos y segundos
  const minutes = Math.floor(secondsLeftRef.current / 60);
  let seconds = secondsLeftRef.current % 60;
  let secondsString = `${seconds}`;
  if (seconds < 10) secondsString = '0' + seconds; // 25:0 => 25:00

  const [playClickSfx] = useSound(clickSfx);
  const [playClickUi] = useSound(clickUiSfx);
  const [playDingSfx] = useSound(dingSfx);

  function switchMode(): void {
    const nextMode = modeRef.current === 'Work' ? 'Break' : 'Work';  //si es 'Work' el siguiente es 'Break' sino 'Work'
    const nextSeconds = (nextMode === 'Work' ? WorkMinutes : BreakMinutes) * 60;  //segundos


    setMode(nextMode);
    setSecondsLeft(nextSeconds);
    //Actualizamos referencias
    modeRef.current = nextMode;
    secondsLeftRef.current = nextSeconds;
  }

  function tick(): void {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
  }

  function initTimer(): void {
    setSecondsLeft(WorkMinutes * 60); //Iniciamos en Work
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused]);

  //esto es una mickeyherramienta para mas tarde
  // const totalSeconds = mode === 'Work'
  //   ? WorkMinutes * 60
  //   : BreakMinutes * 60;
  // const percentage = Math.round(secondsLeftRef.current / totalSeconds) * 100;

  function switchWatch(watch: string): void {
    const nextWatch = watch  //si es 'Work' el siguiente es 'Break' sino 'Work'

    setWatch(nextWatch);
    watchRef.current = nextWatch;
    setIsPaused(true);
    isPausedRef.current = true
  }

  function switchWatchNode(): React.ReactNode {
    return watch === "stop" ? <Stopwatch /> :
      <>
        <div className='px-8 py-2 my-2 text-xl text-gray-600 rounded shadow cursor-default bg-gray-400'>{mode}</div>
        {
          timerNode()
        }
        <div>
          {
            playPauseButtonNode()
          }
        </div>
        <div>
          {
            switchModeButtonNode()
          }
        </div>
      </>
  }

  function timerNode(): React.ReactNode {
    return isPaused
      ? <div className='w-auto p-4 my-2 text-6xl font-bold rounded cursor-default bg-rusty-red'>{minutes + ':' + secondsString}</div>
      : <div className='w-auto p-4 my-2 text-6xl font-bold rounded cursor-default bg-gray-100'>{minutes + ':' + secondsString}</div>;
  }

  function playPauseButtonNode(): React.ReactNode {
    return isPaused ?
      <button
        onClick={() => { setIsPaused(false); isPausedRef.current = false; playClickUi(); }}
        className="px-8 py-2 my-2 text-lg text-gray-500 rounded shadow bg-gray-100 hover:bg-white shadow-pale-silver"
      >
        Play
      </button> :
      <button
        onClick={() => { setIsPaused(true); isPausedRef.current = true; playClickUi(); }}
        className="px-8 py-2 my-2 text-lg text-gray-500 rounded shadow bg-gray-100 hover:bg-white shadow-pale-silver"
      >
        Pause
      </button>;
  }

  function switchModeButtonNode(): React.ReactNode {
    return mode === 'Work'
      ? <button
        onClick={() => { switchMode(); playClickSfx(); }}
        className="px-8 py-2 my-2 text-lg text-gray-500 rounded shadow bg-gray-100 hover:bg-white shadow-pale-silver">Break</button>
      : <button
        onClick={() => { switchMode(); playClickSfx(); }}
        className="px-8 py-2 my-2 text-lg text-gray-500 rounded shadow bg-gray-100 hover:bg-white shadow-pale-silver">Work</button>;
  }

  return (
    <div className='flex flex-col items-center w-11/12 max-w-screen-sm py-2 my-2 font-mono text-center border-gray-300 rounded shadow-orange-500/50'>
      <div>
        <button
          onClick={() => { switchWatch("pomo"); playClickSfx(); }}
          className='px-4 py-2 mx-2 my-2 text-lg font-bold text-white rounded shadow bg-gray-100 hover:bg-white hover:scale-105'>🍅</button>
        <button
          onClick={() => { switchWatch("stop"); playClickSfx(); }}
          className='px-4 py-2 mx-2 my-2 text-lg font-bold text-white rounded shadow bg-gray-100 hover:bg-white hover:scale-105'>⌛</button>
      </div>
      <div>
        {
          switchWatchNode()
        }
      </div>
    </div>

  )
}

export default Timer
