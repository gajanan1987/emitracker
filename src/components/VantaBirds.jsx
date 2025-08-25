import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import BIRDS from "vanta/dist/vanta.birds.min";

export default function VantaBirds() {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        BIRDS({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          backgroundColor: 0xf1f2f5,
          color1: 0x2136b9,
          color2: 0xf70f0f,
          wingSpan: 20.0,
          speedLimit: 4.0,
          backgroundAlpha: 0.0,
          birdSize: 0.5,
          quantity: 2.5,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return <div ref={vantaRef} className="vanta-birds" />;
}
