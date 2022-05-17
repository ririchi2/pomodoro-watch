import React, { useEffect, useRef, useState } from 'react'
import useSound from 'use-sound';
import Stopwatch from './Stopwatch';
const clickSfx = require('../sounds/click.mp3');
const clickUiSfx = require('../sounds/clickui.mp3');
const dingSfx = require('../sounds/dingelevator.mp3');


function Timer(): JSX.Element {
  const workMinutes = 25;
  const breakMinutes = 5;

  const [secondsLeft, setSecondsLeft] = useState(1500); //Inicializamos a 1500 porque 1500segs = 25min
  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState('work');
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
    const nextMode = modeRef.current === 'work' ? 'break' : 'work';  //si es 'work' el siguiente es 'break' sino 'work'
    const nextSeconds = (nextMode === 'work' ? workMinutes : breakMinutes) * 60;  //segundos


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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused]);

  //esto es una mickeyherramienta para mas tarde
  // const totalSeconds = mode === 'work'
  //   ? workMinutes * 60
  //   : breakMinutes * 60;
  // const percentage = Math.round(secondsLeftRef.current / totalSeconds) * 100;

  function switchWatch(watch: string): void {
    const nextWatch = watch  //si es 'work' el siguiente es 'break' sino 'work'

    setWatch(nextWatch);
    watchRef.current = nextWatch;
    setIsPaused(true);
    isPausedRef.current = true
  }

  function switchWatchNode(): React.ReactNode {
    return watch === "stop"
      ? <Stopwatch />
      : <>
        <div className='px-8 py-2 my-2 text-xl font-bold text-white rounded shadow-lg cursor-default bg-cyan-700'>{mode}</div>
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
      ? <div className='w-auto p-4 my-2 text-6xl font-bold rounded-lg cursor-default bg-rusty-red'>{minutes + ':' + secondsString}</div>
      : <div className='w-auto p-4 my-2 text-6xl font-bold rounded-lg cursor-default bg-pale-silver'>{minutes + ':' + secondsString}</div>;
  }

  function playPauseButtonNode(): React.ReactNode {
    return isPaused
      ? <button
        onClick={() => { setIsPaused(false); isPausedRef.current = false; playClickUi(); }}
        className="px-8 py-2 my-2 text-lg font-bold text-white rounded shadow-lg bg-black-coffee hover:bg-black-coffee/90 shadow-pale-silver"
      >Play</button>
      : <button
        onClick={() => { setIsPaused(true); isPausedRef.current = true; playClickUi(); }}
        className="px-8 py-2 my-2 text-lg font-bold text-white rounded shadow-lg bg-black-coffee hover:bg-black-coffee/90 shadow-pale-silver"
      >Pause</button>;
  }

  function switchModeButtonNode(): React.ReactNode {
    return mode === 'work'
      ? <button
        onClick={() => { switchMode(); playClickSfx(); }}
        className="px-8 py-2 my-2 text-lg font-bold text-white rounded shadow-lg bg-black-coffee hover:bg-black-coffee/90 shadow-pale-silver">Break</button>
      : <button
        onClick={() => { switchMode(); playClickSfx(); }}
        className="px-8 py-2 my-2 text-lg font-bold text-white rounded shadow-lg bg-black-coffee hover:bg-black-coffee/90 shadow-pale-silver">Work</button>;
  }

  return (
    <div className='flex flex-col items-center w-11/12 max-w-screen-sm py-2 my-2 font-mono text-center border border-transparent rounded bg-amazon shadow-orange-500/50'>
      <div>
        <button
          onClick={() => { switchWatch("pomo"); playClickSfx(); }}
          className='px-4 py-2 mx-2 my-2 text-lg font-bold text-white rounded shadow-lg bg-black-coffee hover:bg-black-coffee/90 hover:scale-105'>🍅</button>
        <button
          onClick={() => { switchWatch("stop"); playClickSfx(); }}
          className='px-4 py-2 mx-2 my-2 text-lg font-bold text-white rounded shadow-lg bg-black-coffee hover:bg-black-coffee/90 hover:scale-105'>⌛</button>
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