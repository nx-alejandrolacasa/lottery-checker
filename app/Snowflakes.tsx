'use client'

import {useEffect} from "react";

export function Snowflakes() {
  useEffect(() => {
    const newStyle = document.createElement('style')

    newStyle.innerHTML = `
    .snowflake {
        position: fixed;
        top: -10px;
        z-index: 9999;
        color: white;
        user-select: none;
        pointer-events: none;
        font-size: 1em;
        animation-name: fall;
        animation-timing-function: linear;
    }
 
    @keyframes fall {
      to {
        transform: translateY(100vh);
      }
    }`

    function createSnowflake() {
      const snowflake = document.createElement('div');
      snowflake.classList.add('snowflake');
      snowflake.textContent = '❄';
      snowflake.style.left = Math.random() * 100 + 'vw';
      snowflake.style.opacity = Math.random().toString();
      snowflake.style.fontSize = Math.random() * 24 + 10 + 'px';
      snowflake.style.animationDuration = Math.random() * 9 + 7 + 's'; // Zwischen 2 und 5 Sekunden

      document.body.appendChild(snowflake);

      // Entfernt die Schneeflocke nach dem Fallen
      setTimeout(() => {
        snowflake.remove();
      // @ts-ignore
      }, snowflake.style.animationDuration.replace('s', '') * 1000);
    }

    document.body.appendChild(newStyle)

    setInterval(createSnowflake, 250);
  }, [])

  return null
}
