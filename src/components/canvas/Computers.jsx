import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";

import CanvasLoader from "../Loader";

const scenePalette = {
  deskTop: "#183735",
  deskEdge: "#0a1918",
  deskTrim: "#20504b",
  laptopBody: "#d8ebe5",
  laptopShadow: "#3a5752",
  keyboard: "#0c1c1b",
  keycaps: "#13312e",
  screenFrame: "#102422",
  screenGlow: "#92f1e6",
  screenAccent: "#2ac4ba",
  screenText: "#d9fffb",
  headset: "#0f2624",
  headsetCushion: "#275b55",
  bottle: "#6addd0",
  bottleCap: "#103430",
  mouse: "#d9ebe6",
  mouseTrim: "#86d8ce",
  bookCover: "#14403b",
  bookPages: "#d9f0eb",
  penBody: "#d7f7f2",
  penCap: "#0e8074",
  mugBody: "#dff7f2",
  mugCoffee: "#1a1411",
  phoneBody: "#050909",
  phoneScreen: "#0b2724",
  phoneGlow: "#51d8cb",
};

const screenPanels = [
  { position: [-0.98, 1.84, 0.11], size: [0.78, 0.12, 0.01], color: scenePalette.screenText },
  { position: [-0.12, 1.84, 0.11], size: [1.16, 0.12, 0.01], color: scenePalette.screenText },
  { position: [0.96, 1.84, 0.11], size: [0.42, 0.12, 0.01], color: scenePalette.screenAccent },
  { position: [-1.24, 1.55, 0.11], size: [0.38, 0.09, 0.01], color: scenePalette.screenAccent },
  { position: [-0.78, 1.55, 0.11], size: [0.46, 0.09, 0.01], color: scenePalette.screenText },
  { position: [-0.16, 1.55, 0.11], size: [0.72, 0.09, 0.01], color: scenePalette.screenText },
  { position: [0.56, 1.55, 0.11], size: [0.62, 0.09, 0.01], color: scenePalette.screenAccent },
  { position: [-0.98, 1.2, 0.11], size: [0.72, 0.12, 0.01], color: scenePalette.screenAccent },
  { position: [-0.2, 1.2, 0.11], size: [0.84, 0.12, 0.01], color: scenePalette.screenText },
  { position: [0.74, 1.2, 0.11], size: [0.24, 0.12, 0.01], color: scenePalette.screenAccent },
  { position: [-1.1, 0.84, 0.11], size: [0.3, 0.09, 0.01], color: scenePalette.screenText },
  { position: [-0.7, 0.84, 0.11], size: [0.76, 0.09, 0.01], color: scenePalette.screenText },
  { position: [0.08, 0.84, 0.11], size: [0.56, 0.09, 0.01], color: scenePalette.screenAccent },
  { position: [0.82, 0.84, 0.11], size: [0.38, 0.09, 0.01], color: scenePalette.screenText },
];

const keyboardRows = [
  { z: -0.38, keys: 11, width: 0.19 },
  { z: -0.02, keys: 10, width: 0.22 },
  { z: 0.34, keys: 9, width: 0.25 },
  { z: 0.7, keys: 7, width: 0.31 },
];

const Laptop = () => (
  <group position={[0, 0.02, 0.15]}>
    <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
      <boxGeometry args={[4.7, 0.16, 3.2]} />
      <meshStandardMaterial color={scenePalette.laptopBody} metalness={0.36} roughness={0.2} />
    </mesh>
    <mesh castShadow receiveShadow position={[0, 0.16, 0.06]}>
      <boxGeometry args={[4.26, 0.04, 2.26]} />
      <meshStandardMaterial color={scenePalette.keyboard} metalness={0.18} roughness={0.56} />
    </mesh>
    {keyboardRows.map((row, rowIndex) => (
      Array.from({ length: row.keys }, (_, keyIndex) => {
        const rowWidth = row.keys * row.width + (row.keys - 1) * 0.08;
        const startX = -rowWidth / 2 + row.width / 2;

        return (
          <mesh
            key={`key-${rowIndex}-${keyIndex}`}
            castShadow
            receiveShadow
            position={[startX + keyIndex * (row.width + 0.08), 0.185, row.z]}
          >
            <boxGeometry args={[row.width, 0.03, 0.22]} />
            <meshStandardMaterial color={scenePalette.keycaps} metalness={0.1} roughness={0.58} />
          </mesh>
        );
      })
    ))}
    <mesh castShadow receiveShadow position={[0, 0.18, 1.05]}>
      <boxGeometry args={[1.18, 0.02, 0.82]} />
      <meshStandardMaterial color={scenePalette.laptopShadow} metalness={0.18} roughness={0.44} />
    </mesh>
    <mesh castShadow receiveShadow position={[0, 0.19, -1.54]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.08, 0.08, 4.25, 24]} />
      <meshStandardMaterial color={scenePalette.laptopShadow} metalness={0.4} roughness={0.24} />
    </mesh>

    <group position={[0, 0.26, -1.54]} rotation={[-0.74, 0, 0]}>
      <mesh castShadow receiveShadow position={[0, 1.3, 0]}>
        <boxGeometry args={[4.3, 2.72, 0.14]} />
        <meshStandardMaterial color={scenePalette.screenFrame} metalness={0.28} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.3, 0.09]}>
        <boxGeometry args={[3.96, 2.36, 0.02]} />
        <meshStandardMaterial color="#0a1716" metalness={0.08} roughness={0.34} />
      </mesh>
      <mesh position={[0, 1.3, 0.1]}>
        <boxGeometry args={[3.9, 2.3, 0.01]} />
        <meshStandardMaterial
          color={scenePalette.screenGlow}
          emissive={scenePalette.screenGlow}
          emissiveIntensity={0.36}
          transparent
          opacity={0.12}
        />
      </mesh>
      {screenPanels.map((panel, index) => (
        <mesh key={`screen-panel-${index}`} position={panel.position}>
          <boxGeometry args={panel.size} />
          <meshStandardMaterial
            color={panel.color}
            emissive={panel.color}
            emissiveIntensity={0.62}
          />
        </mesh>
      ))}
      <mesh position={[0, 2.47, 0.08]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color={scenePalette.laptopBody} metalness={0.2} roughness={0.25} />
      </mesh>
    </group>
  </group>
);

const Headset = () => (
  <group position={[-4.45, 0.12, -0.35]} rotation={[0.02, 0.34, 0]}>
    <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
      <cylinderGeometry args={[0.5, 0.56, 0.16, 28]} />
      <meshStandardMaterial color={scenePalette.deskTrim} metalness={0.12} roughness={0.48} />
    </mesh>
    <mesh castShadow receiveShadow position={[0, 0.75, 0]}>
      <cylinderGeometry args={[0.08, 0.08, 1.1, 22]} />
      <meshStandardMaterial color={scenePalette.headset} metalness={0.24} roughness={0.34} />
    </mesh>
    <mesh castShadow receiveShadow position={[0, 1.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.58, 0.08, 14, 40, Math.PI]} />
      <meshStandardMaterial color={scenePalette.headset} metalness={0.24} roughness={0.34} />
    </mesh>
    <mesh castShadow receiveShadow position={[-0.44, 1.02, 0.02]}>
      <cylinderGeometry args={[0.18, 0.18, 0.28, 24]} />
      <meshStandardMaterial color={scenePalette.headsetCushion} metalness={0.12} roughness={0.48} />
    </mesh>
    <mesh castShadow receiveShadow position={[0.44, 1.02, 0.02]}>
      <cylinderGeometry args={[0.18, 0.18, 0.28, 24]} />
      <meshStandardMaterial color={scenePalette.headsetCushion} metalness={0.12} roughness={0.48} />
    </mesh>
  </group>
);

const WaterBottle = () => (
  <group position={[4.2, 0.12, -1.32]} rotation={[0, 0.12, 0]}>
    <mesh castShadow receiveShadow position={[0, 1.1, 0]}>
      <cylinderGeometry args={[0.31, 0.36, 1.9, 30]} />
      <meshStandardMaterial
        color={scenePalette.bottle}
        emissive={scenePalette.screenAccent}
        emissiveIntensity={0.08}
        transparent
        opacity={0.32}
        metalness={0.08}
        roughness={0.12}
      />
    </mesh>
    <mesh castShadow receiveShadow position={[0, 2.05, 0]}>
      <cylinderGeometry args={[0.18, 0.18, 0.28, 20]} />
      <meshStandardMaterial color={scenePalette.bottleCap} metalness={0.22} roughness={0.32} />
    </mesh>
    <mesh castShadow receiveShadow position={[0, 2.27, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.13, 0.04, 12, 24]} />
      <meshStandardMaterial color={scenePalette.bottleCap} metalness={0.22} roughness={0.32} />
    </mesh>
  </group>
);

const WirelessMouse = () => (
  <group position={[2.35, 0.14, 1.3]} rotation={[0, -0.22, 0]}>
    <mesh castShadow receiveShadow position={[0, 0.16, 0]} scale={[1.2, 0.48, 1.58]}>
      <sphereGeometry args={[0.34, 24, 24]} />
      <meshStandardMaterial color={scenePalette.mouse} metalness={0.18} roughness={0.28} />
    </mesh>
    <mesh position={[0, 0.2, 0.08]} scale={[0.14, 0.6, 0.22]}>
      <sphereGeometry args={[0.18, 16, 16]} />
      <meshStandardMaterial color={scenePalette.mouseTrim} metalness={0.12} roughness={0.34} />
    </mesh>
  </group>
);

const Book = () => (
  <group position={[-4.05, 0.12, 1.45]} rotation={[0, 0.18, 0]}>
    <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
      <boxGeometry args={[2.2, 0.16, 1.72]} />
      <meshStandardMaterial color={scenePalette.bookCover} metalness={0.18} roughness={0.52} />
    </mesh>
    <mesh castShadow receiveShadow position={[0, 0.16, 0.02]}>
      <boxGeometry args={[2.04, 0.05, 1.56]} />
      <meshStandardMaterial color={scenePalette.bookPages} metalness={0.05} roughness={0.72} />
    </mesh>
  </group>
);

const Pen = () => (
  <group position={[-3.9, 0.26, 1.08]} rotation={[0.12, 0.12, 1.08]}>
    <mesh castShadow receiveShadow>
      <cylinderGeometry args={[0.04, 0.04, 1.46, 16]} />
      <meshStandardMaterial color={scenePalette.penBody} metalness={0.28} roughness={0.2} />
    </mesh>
    <mesh castShadow receiveShadow position={[0, 0.58, 0]}>
      <cylinderGeometry args={[0.045, 0.055, 0.24, 16]} />
      <meshStandardMaterial color={scenePalette.penCap} metalness={0.24} roughness={0.28} />
    </mesh>
  </group>
);

const CoffeeMug = () => (
  <group position={[-2.55, 0.14, 1.58]} rotation={[0, -0.14, 0]}>
    <mesh castShadow receiveShadow position={[0, 0.28, 0]}>
      <cylinderGeometry args={[0.32, 0.38, 0.56, 26]} />
      <meshStandardMaterial color={scenePalette.mugBody} metalness={0.12} roughness={0.34} />
    </mesh>
    <mesh position={[0, 0.52, 0]}>
      <cylinderGeometry args={[0.24, 0.24, 0.06, 20]} />
      <meshStandardMaterial color={scenePalette.mugCoffee} metalness={0.03} roughness={0.84} />
    </mesh>
    <mesh castShadow receiveShadow position={[0.38, 0.28, 0]} rotation={[0, 0, Math.PI / 2]}>
      <torusGeometry args={[0.15, 0.04, 10, 24]} />
      <meshStandardMaterial color={scenePalette.mugBody} metalness={0.12} roughness={0.34} />
    </mesh>
  </group>
);

const Phone = () => (
  <group position={[4.02, 0.1, 1.62]} rotation={[0.08, 0.18, 0.08]}>
    <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
      <boxGeometry args={[0.82, 0.08, 1.52]} />
      <meshStandardMaterial color={scenePalette.phoneBody} metalness={0.26} roughness={0.18} />
    </mesh>
    <mesh position={[0, 0.1, 0]}>
      <boxGeometry args={[0.68, 0.01, 1.34]} />
      <meshStandardMaterial
        color={scenePalette.phoneScreen}
        emissive={scenePalette.phoneGlow}
        emissiveIntensity={0.18}
      />
    </mesh>
    <mesh position={[0, 0.1, -0.58]}>
      <sphereGeometry args={[0.03, 14, 14]} />
      <meshStandardMaterial color={scenePalette.laptopBody} metalness={0.18} roughness={0.24} />
    </mesh>
  </group>
);

const DeskScene = ({ isMobile }) => {
  const scale = isMobile ? 0.62 : 0.78;
  const position = isMobile ? [0, -3.7, -0.45] : [0, -3.72, -0.95];

  return (
    <group scale={scale} position={position} rotation={[0.02, -0.14, -0.01]}>
      <mesh castShadow receiveShadow position={[0, -0.2, 0]}>
        <boxGeometry args={[11.8, 0.34, 6.2]} />
        <meshStandardMaterial color={scenePalette.deskTop} metalness={0.22} roughness={0.54} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.39, 0.22]}>
        <boxGeometry args={[12.1, 0.16, 6.5]} />
        <meshStandardMaterial color={scenePalette.deskEdge} metalness={0.16} roughness={0.64} />
      </mesh>
      <mesh receiveShadow position={[0, -0.01, 0.95]}>
        <boxGeometry args={[3.8, 0.02, 2]} />
        <meshStandardMaterial color={scenePalette.deskTrim} metalness={0.12} roughness={0.5} />
      </mesh>

      <Laptop />
      <Headset />
      <WaterBottle />
      <WirelessMouse />
      <Book />
      <Pen />
      <CoffeeMug />
      <Phone />
    </group>
  );
};

const Computers = ({ isMobile }) => {
  return (
    <group>
      <hemisphereLight intensity={0.15} groundColor='black' />
      <spotLight
        position={[14, 22, 10]}
        angle={0.22}
        penumbra={1}
        intensity={2.2}
        castShadow
        shadow-mapSize={2048}
      />
      <pointLight position={[-8, 5, 4]} intensity={1.2} color='#93f4e9' />
      <pointLight position={[8, 4, -3]} intensity={0.7} color='#0f766e' />
      <DeskScene isMobile={isMobile} />
    </group>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop='demand'
      shadows
      dpr={[1, 2]}
      camera={{ position: [16.8, 5.1, 10.8], fov: 26 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          target={[0, -1.7, 0]}
          maxPolarAngle={Math.PI / 1.95}
          minPolarAngle={Math.PI / 2.6}
        />
        <Computers isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
