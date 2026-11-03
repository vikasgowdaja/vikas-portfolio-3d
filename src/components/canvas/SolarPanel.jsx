import React, { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

const PANEL_WIDTH = 2.8;
const PANEL_HEIGHT = 1.68;
const CELL_COLUMNS = 8;
const CELL_ROWS = 5;
const CELL_AREA_WIDTH = 2.56;
const CELL_AREA_HEIGHT = 1.44;
const CELL_GAP = 0.016;

const cellPositions = Array.from({ length: CELL_COLUMNS * CELL_ROWS }, (_, cellIndex) => {
  const column = cellIndex % CELL_COLUMNS;
  const row = Math.floor(cellIndex / CELL_COLUMNS);
  const cellWidth = CELL_AREA_WIDTH / CELL_COLUMNS;
  const cellHeight = CELL_AREA_HEIGHT / CELL_ROWS;

  return {
    id: cellIndex,
    color: cellIndex % 2 === 0 ? "#12375a" : "#0c2e4d",
    position: [
      -CELL_AREA_WIDTH / 2 + cellWidth * (column + 0.5),
      CELL_AREA_HEIGHT / 2 - cellHeight * (row + 0.5),
      0.11,
    ],
    size: [cellWidth - CELL_GAP, cellHeight - CELL_GAP],
  };
});

const SteelBrace = ({ start, end }) => {
  const transform = useMemo(() => {
    const startPoint = new THREE.Vector3(...start);
    const endPoint = new THREE.Vector3(...end);
    const direction = new THREE.Vector3().subVectors(endPoint, startPoint);
    const length = direction.length();
    const position = startPoint.add(endPoint).multiplyScalar(0.5);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize()
    );

    return { position, quaternion, length };
  }, [start, end]);

  return (
    <mesh position={transform.position} quaternion={transform.quaternion} castShadow receiveShadow>
      <cylinderGeometry args={[0.035, 0.045, transform.length, 12]} />
      <meshStandardMaterial color='#8698a5' metalness={0.72} roughness={0.3} />
    </mesh>
  );
};

const SolarCell = ({ position, size, color }) => (
  <mesh position={position} castShadow>
    <boxGeometry args={[size[0], size[1], 0.014]} />
    <meshStandardMaterial color={color} metalness={0.34} roughness={0.28} />
  </mesh>
);

export const SolarPanelModel = () => (
  <group>
    <group position={[0, 1.48, 0]} rotation={[-0.36, 0, 0]}>
      <RoundedBox args={[PANEL_WIDTH, PANEL_HEIGHT, 0.12]} radius={0.045} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color='#a8b5bd' metalness={0.78} roughness={0.26} />
      </RoundedBox>

      <RoundedBox args={[2.62, 1.5, 0.025]} position={[0, 0, 0.073]} radius={0.018} smoothness={2}>
        <meshStandardMaterial color='#071a2b' metalness={0.38} roughness={0.34} />
      </RoundedBox>

      {cellPositions.map((cell) => (
        <SolarCell key={cell.id} position={cell.position} size={cell.size} color={cell.color} />
      ))}

      {[0.25, -0.25].map((rowPosition) => (
        <mesh key={rowPosition} position={[0, rowPosition, 0.12]}>
          <boxGeometry args={[CELL_AREA_WIDTH, 0.012, 0.008]} />
          <meshStandardMaterial color='#7da3be' metalness={0.62} roughness={0.3} />
        </mesh>
      ))}

      <RoundedBox args={[0.42, 0.16, 0.08]} position={[0, -0.72, -0.105]} radius={0.025} smoothness={2} castShadow>
        <meshStandardMaterial color='#202d38' metalness={0.55} roughness={0.38} />
      </RoundedBox>
    </group>

    <mesh position={[0, 0.055, 0.74]} castShadow receiveShadow>
      <boxGeometry args={[2.55, 0.1, 0.18]} />
      <meshStandardMaterial color='#62717b' metalness={0.74} roughness={0.3} />
    </mesh>

    <SteelBrace start={[-0.92, 0.12, 0.68]} end={[-0.92, 0.82, 0.1]} />
    <SteelBrace start={[0.92, 0.12, 0.68]} end={[0.92, 0.82, 0.1]} />
    <SteelBrace start={[-0.92, 0.82, 0.1]} end={[0.92, 0.82, 0.1]} />

    <mesh position={[0, 0.12, 0.68]}>
      <boxGeometry args={[2.06, 0.07, 0.12]} />
      <meshStandardMaterial color='#8698a5' metalness={0.72} roughness={0.3} />
    </mesh>
  </group>
);