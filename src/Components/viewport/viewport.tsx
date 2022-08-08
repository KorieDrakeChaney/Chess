import {useEffect, useRef } from 'react'
import Board from '../../game/Board';
import style from "./viewport.module.css"
import useSound from 'use-sound';


const Viewport = () => { 
  const ref = useRef(null);
  const [play] = useSound('/sounds/capture.mp3');
  useEffect(() => {
    if(ref.current){
        new Board(ref.current);
        ref.current.addEventListener("contextmenu", (e : Event) => e.preventDefault());
        play()
        
    }
  }, [ref])

  return ( 
    <>
        <canvas ref={ref}
        className={style.scene}
    />
    </>
 
  )
}


export default Viewport;