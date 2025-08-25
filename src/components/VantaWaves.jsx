import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function VantaWaves() {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    const loadVanta = async () => {
      const VANTA = (await import("vanta/dist/vanta.waves.min")).default;
      if (!vantaEffect) {
        setVantaEffect(
          VANTA({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0x4f46e5,
            shininess: 50,
            waveHeight: 20,
            waveSpeed: 0.8,
            zoom: 1.2,
          })
        );
      }
    };

    loadVanta();

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return <div ref={vantaRef} className="w-full h-screen absolute -z-10"></div>;
}
