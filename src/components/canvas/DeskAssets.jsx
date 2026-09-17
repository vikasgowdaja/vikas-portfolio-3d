import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";

import CanvasLoader from "../Loader";
import {
  CoffeeMugModel,
  DeskBaseModel,
  HeadphonesModel,
  LaptopModel,
  MouseModel,
  NotebookModel,
  PenModel,
  PhoneModel,
  WaterBottleModel,
  applySceneTheme,
  getActiveThemeName,
  getSceneLighting,
} from "./Laptop";

const PreviewLights = ({ lights }) => {
  return (
    <>
      <ambientLight intensity={lights.ambient + 0.04} />
      <hemisphereLight intensity={lights.hemisphere} color={lights.hemisphereColor} groundColor={lights.groundColor} />
      <spotLight position={[8, 10, 8]} angle={0.4} penumbra={0.7} intensity={Math.max(1.4, lights.spotIntensity - 0.3)} castShadow shadow-mapSize={1024} />
      <pointLight position={[-4, 3, 4]} intensity={Math.max(0.48, lights.fillLeft.intensity - 0.2)} color={lights.fillLeft.color} />
    </>
  );
};

const PreviewCanvas = ({ camera, target, children }) => {
  const [themeName, setThemeName] = useState(() => getActiveThemeName());

  useEffect(() => {
    const syncTheme = () => {
      setThemeName(getActiveThemeName());
    };

    const observer = new MutationObserver(() => {
      syncTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    window.addEventListener("portfolio-theme-change", syncTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener("portfolio-theme-change", syncTheme);
    };
  }, []);

  applySceneTheme(themeName);
  const lights = getSceneLighting(themeName);

  return (
    <Canvas
      frameloop='always'
      shadows
      dpr={[1, 2]}
      camera={camera}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enablePan={false} enableZoom={false} target={target} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.8} />
        <PreviewLights lights={lights} />
        {children}
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

const SupportStage = ({ children }) => {
  const supportRef = useRef(null);

  return <group ref={supportRef}>{children(supportRef)}</group>;
};

export const DeskOnlyCanvas = () => {
  return (
    <PreviewCanvas camera={{ position: [8.8, 3.6, 9.2], fov: 25 }} target={[0, -0.28, 0.2]}>
      <group scale={0.9} position={[0, -0.35, 0]} rotation={[0.03, -0.25, -0.01]}>
        <DeskBaseModel />
      </group>
    </PreviewCanvas>
  );
};

export const LaptopOnlyCanvas = () => {
  return (
    <PreviewCanvas camera={{ position: [6.5, 3.2, 7.8], fov: 28 }} target={[0, 0.9, -0.8]}>
      <group scale={1.08} position={[0, -0.92, 0.2]} rotation={[0.02, -0.55, 0]}>
        <LaptopModel />
      </group>
    </PreviewCanvas>
  );
};

export const NotebookOnlyCanvas = () => {
  return (
    <PreviewCanvas camera={{ position: [4.2, 2.7, 5.2], fov: 30 }} target={[0, 0.32, 0]}>
      <group scale={2.4} position={[0, -1.25, -0.1]} rotation={[0.02, -0.45, 0]}>
        <SupportStage>
          {(supportRef) => <NotebookModel supportRef={supportRef} />}
        </SupportStage>
      </group>
    </PreviewCanvas>
  );
};

export const PenOnlyCanvas = () => {
  return (
    <PreviewCanvas camera={{ position: [3.4, 2.4, 4.2], fov: 31 }} target={[0, 0.08, 0]}>
      <group scale={3.2} position={[0, -1.08, 0]} rotation={[0.14, -0.75, 0.98]}>
        <SupportStage>
          {(supportRef) => <PenModel supportRef={supportRef} />}
        </SupportStage>
      </group>
    </PreviewCanvas>
  );
};

export const MugOnlyCanvas = () => {
  return (
    <PreviewCanvas camera={{ position: [3.9, 2.4, 4.8], fov: 30 }} target={[0, 0.4, 0]}>
      <group scale={2.2} position={[0, -1.02, 0]} rotation={[0.02, -0.4, 0]}>
        <SupportStage>
          {(supportRef) => <CoffeeMugModel supportRef={supportRef} />}
        </SupportStage>
      </group>
    </PreviewCanvas>
  );
};

export const BottleOnlyCanvas = () => {
  return (
    <PreviewCanvas camera={{ position: [4.1, 2.6, 5], fov: 30 }} target={[0, 0.6, 0]}>
      <group scale={2.15} position={[0, -1.05, 0]} rotation={[0.02, -0.45, 0]}>
        <SupportStage>
          {(supportRef) => <WaterBottleModel supportRef={supportRef} />}
        </SupportStage>
      </group>
    </PreviewCanvas>
  );
};

export const PhoneOnlyCanvas = () => {
  return (
    <PreviewCanvas camera={{ position: [2.8, 2.2, 3.8], fov: 32 }} target={[0, 0.08, 0]}>
      <group scale={3.2} position={[0, -0.95, 0]} rotation={[0.08, -0.8, 0.16]}>
        <SupportStage>
          {(supportRef) => <PhoneModel supportRef={supportRef} />}
        </SupportStage>
      </group>
    </PreviewCanvas>
  );
};

export const MouseOnlyCanvas = () => {
  return (
    <PreviewCanvas camera={{ position: [2.9, 2.2, 3.8], fov: 32 }} target={[0, 0.12, 0]}>
      <group scale={3.2} position={[0, -0.98, 0]} rotation={[0.04, -0.6, 0.03]}>
        <SupportStage>
          {(supportRef) => <MouseModel supportRef={supportRef} />}
        </SupportStage>
      </group>
    </PreviewCanvas>
  );
};

export const HeadphonesOnlyCanvas = () => {
  return (
    <PreviewCanvas camera={{ position: [3.2, 2.5, 4.2], fov: 32 }} target={[0, 0.5, 0]}>
      <group scale={2.5} position={[0, -1.05, 0]} rotation={[0.03, -0.55, 0]}>
        <SupportStage>
          {(supportRef) => <HeadphonesModel supportRef={supportRef} />}
        </SupportStage>
      </group>
    </PreviewCanvas>
  );
};
