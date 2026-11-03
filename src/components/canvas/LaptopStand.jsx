import React, { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

import { LaptopModel } from "./Laptop";

const standBraces = [
  { id: "left-rear", start: [-1.48, 0.17, -0.74], end: [-1.48, 1.21, -0.9] },
  { id: "right-rear", start: [1.48, 0.17, -0.74], end: [1.48, 1.21, -0.9] },
  { id: "left-angle", start: [-1.48, 0.17, 0.68], end: [-1.48, 0.91, -0.83] },
  { id: "right-angle", start: [1.48, 0.17, 0.68], end: [1.48, 0.91, -0.83] },
];

const adjustmentPositions = [-0.58, -0.34, -0.1, 0.14, 0.38, 0.62];
const rgbSegments = ["#2de2c5", "#438dff", "#9164ff", "#ee55c8", "#2de2c5"];

const MetalBrace = ({ start, end }) => {
  const transform = useMemo(() => {
    const startPoint = new THREE.Vector3(...start);
    const endPoint = new THREE.Vector3(...end);
    const direction = new THREE.Vector3().subVectors(endPoint, startPoint);
    const length = direction.length();
    const position = startPoint.clone().add(endPoint).multiplyScalar(0.5);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize()
    );

    return { position, quaternion, length };
  }, [start, end]);

  return (
    <mesh position={transform.position} quaternion={transform.quaternion} castShadow receiveShadow>
      <boxGeometry args={[0.11, transform.length, 0.075]} />
      <meshStandardMaterial color='#9aa8b2' metalness={0.82} roughness={0.24} />
    </mesh>
  );
};

const Hinge = ({ position }) => (
  <mesh position={position} rotation={[0, 0, Math.PI / 2]} castShadow>
    <cylinderGeometry args={[0.09, 0.09, 0.2, 24]} />
    <meshStandardMaterial color='#d7e1e6' metalness={0.88} roughness={0.2} />
  </mesh>
);

const CoolingFan = ({ x }) => (
  <group position={[x, 0.112, 0.99]}>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.3, 0.018, 10, 40]} />
      <meshStandardMaterial color='#596b7c' metalness={0.48} roughness={0.38} />
    </mesh>
    {Array.from({ length: 7 }, (_, bladeIndex) => (
      <group key={bladeIndex} rotation={[0, (bladeIndex * Math.PI * 2) / 7, 0]}>
        <mesh position={[0, 0.01, -0.11]}>
          <boxGeometry args={[0.075, 0.018, 0.2]} />
          <meshStandardMaterial color='#263646' metalness={0.24} roughness={0.42} />
        </mesh>
      </group>
    ))}
    <mesh position={[0, 0.025, 0]}>
      <cylinderGeometry args={[0.064, 0.064, 0.036, 20]} />
      <meshStandardMaterial color='#728494' metalness={0.68} roughness={0.25} />
    </mesh>
  </group>
);

const RgbCoolingPad = () => (
  <group position={[0, 1.08, 0]} rotation={[0.18, 0, 0]}>
    <RoundedBox args={[3.9, 0.16, 2.68]} radius={0.1} smoothness={3} castShadow receiveShadow>
      <meshStandardMaterial color='#111a22' metalness={0.58} roughness={0.3} />
    </RoundedBox>

    <RoundedBox args={[3.68, 0.022, 2.46]} position={[0, 0.092, -0.015]} radius={0.07} smoothness={3}>
      <meshStandardMaterial color='#1a2834' metalness={0.48} roughness={0.34} />
    </RoundedBox>

    {rgbSegments.map((color, index) => (
      <mesh key={`front-${index}`} position={[-1.56 + index * 0.78, 0.025, 1.315]}>
        <boxGeometry args={[0.78, 0.035, 0.025]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
    ))}

    {rgbSegments.map((color, index) => (
      <mesh key={`side-${index}`} position={[1.935, 0.025, -1.04 + index * 0.52]}>
        <boxGeometry args={[0.025, 0.035, 0.52]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
    ))}

    <CoolingFan x={-0.78} />
    <CoolingFan x={0.78} />

    <group position={[0, 0.105, -0.08]} scale={0.58}>
      <LaptopModel />
    </group>
  </group>
);

export const LaptopStandModel = () => (
  <group>
    <group>
      {[-1.48, 1.48].map((x) => (
        <React.Fragment key={x}>
          <RoundedBox args={[0.18, 0.1, 2.48]} position={[x, 0.11, 0]} radius={0.035} smoothness={2} castShadow receiveShadow>
            <meshStandardMaterial color='#a9b5bd' metalness={0.84} roughness={0.22} />
          </RoundedBox>
          {adjustmentPositions.map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0.165, z]}>
              <cylinderGeometry args={[0.045, 0.045, 0.012, 16]} />
              <meshStandardMaterial color='#3a4752' metalness={0.52} roughness={0.34} />
            </mesh>
          ))}
          <RoundedBox args={[0.22, 0.05, 0.34]} position={[x, 0.16, 1.07]} radius={0.05} smoothness={2}>
            <meshStandardMaterial color='#202a32' roughness={0.7} />
          </RoundedBox>
          <Hinge position={[x, 0.86, -0.83]} />
        </React.Fragment>
      ))}

      {standBraces.map((brace) => (
        <MetalBrace key={brace.id} start={brace.start} end={brace.end} />
      ))}

      <RoundedBox args={[2.74, 0.08, 0.1]} position={[0, 0.79, -0.82]} radius={0.035} smoothness={2}>
        <meshStandardMaterial color='#84949f' metalness={0.8} roughness={0.25} />
      </RoundedBox>

      {[-1.43, 1.43].map((x) => (
        <RoundedBox key={x} args={[0.16, 0.18, 0.12]} position={[x, 0.92, 0.98]} radius={0.035} smoothness={2}>
          <meshStandardMaterial color='#bec9ce' metalness={0.84} roughness={0.22} />
        </RoundedBox>
      ))}
    </group>

    <RgbCoolingPad />
  </group>
);