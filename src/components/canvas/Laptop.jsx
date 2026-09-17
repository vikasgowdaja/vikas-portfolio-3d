import React, { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, RoundedBox, Text } from "@react-three/drei";

import CanvasLoader from "../Loader";

const scenePalette = {
  deskTop: "#153633",
  deskEdge: "#081715",
  deskInset: "#1d4a45",
  laptopBody: "#dcebe7",
  laptopShadow: "#40615b",
  laptopRubber: "#081614",
  keyboardDeck: "#102523",
  keyWell: "#0b1a18",
  keycaps: "#163b37",
  keyAccent: "#245a54",
  trackpad: "#b9cfca",
  trackpadBorder: "#6a8680",
  screenFrame: "#152c29",
  screenBezel: "#091513",
  screenGlow: "#7fe8dc",
  screenText: "#effffc",
  screenPrompt: "#5cd6cc",
  bottleBody: "#7be2d7",
  bottleCap: "#123632",
  bottleRing: "#9af3eb",
  bookCover: "#194842",
  bookPages: "#e9f5f1",
  pageEdge: "#d0e3de",
  penBody: "#143f39",
  penCap: "#0a1413",
  penBand: "#84eadf",
  penTip: "#dde8e4",
  mugBody: "#eef7f5",
  mugCoffee: "#1d1410",
  steam: "#ddfffb",
  phoneBody: "#040808",
  phoneScreen: "#0f2c29",
  phoneGlow: "#52d7cb",
  phoneGlass: "#d9ffff",
  phoneCamera: "#0b1211",
  mouseBody: "#111e1d",
  mouseGrip: "#244a46",
  mouseWheel: "#7ce4d8",
  headphonesBand: "#1a3d39",
  headphonesPad: "#d9ece8",
  headphonesCup: "#0c1817",
  headphonesAccent: "#66d8cb",
};

const deskTopY = 0;
const supportClearance = 0.012;

const screenLines = [
  { text: "> deploy production", y: 2.24, color: scenePalette.screenPrompt },
  { text: "> docker compose up", y: 1.9, color: scenePalette.screenText },
  { text: "> npm run build", y: 1.56, color: scenePalette.screenPrompt },
  { text: "> kubectl get pods", y: 1.22, color: scenePalette.screenText },
  { text: "> system operational", y: 0.88, color: scenePalette.screenPrompt },
];

const keyboardRows = [
  { z: -0.72, y: 0.147, height: 0.022, depth: 0.18, gap: 0.05, widths: [0.24, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.28], accent: [0, 12] },
  { z: -0.36, y: 0.148, height: 0.025, depth: 0.22, gap: 0.052, widths: [0.34, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.36], accent: [0, 11] },
  { z: -0.02, y: 0.149, height: 0.026, depth: 0.22, gap: 0.052, widths: [0.4, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.42], accent: [0, 11] },
  { z: 0.32, y: 0.149, height: 0.026, depth: 0.24, gap: 0.052, widths: [0.52, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.54], accent: [0, 10] },
  { z: 0.68, y: 0.149, height: 0.026, depth: 0.28, gap: 0.084, widths: [0.32, 0.32, 1.18, 0.32, 0.32], accent: [2] },
];

const getBoundsInSpace = (object, relativeTo) => {
  const bounds = new THREE.Box3();

  if (!object || !relativeTo) {
    return bounds.makeEmpty();
  }

  const inverseMatrix = new THREE.Matrix4().copy(relativeTo.matrixWorld).invert();
  const point = new THREE.Vector3();

  relativeTo.updateWorldMatrix(true, true);
  object.updateWorldMatrix(true, true);
  bounds.makeEmpty();

  object.traverse((child) => {
    if (!child.isMesh || !child.geometry) {
      return;
    }

    if (!child.geometry.boundingBox) {
      child.geometry.computeBoundingBox();
    }

    const geometryBounds = child.geometry.boundingBox;

    if (!geometryBounds) {
      return;
    }

    for (const x of [geometryBounds.min.x, geometryBounds.max.x]) {
      for (const y of [geometryBounds.min.y, geometryBounds.max.y]) {
        for (const z of [geometryBounds.min.z, geometryBounds.max.z]) {
          point.set(x, y, z).applyMatrix4(child.matrixWorld).applyMatrix4(inverseMatrix);
          bounds.expandByPoint(point);
        }
      }
    }
  });

  return bounds;
};

const ContactAlignedGroup = ({
  supportRef,
  supportY,
  clearance = supportClearance,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  dependencies = [],
  onBoundsChange,
  children,
}) => {
  const contentRef = useRef(null);
  const [liftY, setLiftY] = useState(0);

  useLayoutEffect(() => {
    if (!supportRef.current || !contentRef.current) {
      return;
    }

    const bounds = getBoundsInSpace(contentRef.current, supportRef.current);

    if (bounds.isEmpty()) {
      return;
    }

    const nextLift = supportY - bounds.min.y + liftY + clearance;
    const deltaLift = nextLift - liftY;

    setLiftY((currentLift) => (Math.abs(currentLift - nextLift) < 0.0005 ? currentLift : nextLift));

    if (onBoundsChange) {
      onBoundsChange({
        minY: bounds.min.y + deltaLift,
        maxY: bounds.max.y + deltaLift,
        height: bounds.max.y - bounds.min.y,
      });
    }
  }, [clearance, liftY, onBoundsChange, supportRef, supportY, ...dependencies]);

  return (
    <group position={position}>
      <group ref={contentRef} position={[0, liftY, 0]} rotation={rotation}>
        {children}
      </group>
    </group>
  );
};

const InstancedKeySet = ({ transforms, color }) => {
  const meshRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    if (!meshRef.current) {
      return;
    }

    transforms.forEach((transform, index) => {
      dummy.position.set(...transform.position);
      dummy.scale.set(...transform.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(index, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy, transforms]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, transforms.length]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} metalness={0.08} roughness={0.56} />
    </instancedMesh>
  );
};

const KeyboardKeys = () => {
  const { standardKeys, accentKeys } = useMemo(() => {
    const standard = [];
    const accent = [];

    keyboardRows.forEach((row) => {
      const totalWidth = row.widths.reduce((sum, width) => sum + width, 0) + row.gap * (row.widths.length - 1);
      let cursorX = -totalWidth / 2;

      row.widths.forEach((width, index) => {
        const transform = {
          position: [cursorX + width / 2, row.y, row.z],
          scale: [width, row.height, row.depth],
        };

        if (row.accent.includes(index)) {
          accent.push(transform);
        } else {
          standard.push(transform);
        }

        cursorX += width + row.gap;
      });
    });

    return { standardKeys: standard, accentKeys: accent };
  }, []);

  return (
    <group>
      <InstancedKeySet transforms={standardKeys} color={scenePalette.keycaps} />
      <InstancedKeySet transforms={accentKeys} color={scenePalette.keyAccent} />
    </group>
  );
};

const DeveloperScreen = () => {
  return (
    <group>
      <mesh position={[0, 1.62, 0.074]}>
        <boxGeometry args={[4.18, 2.7, 0.01]} />
        <meshStandardMaterial color='#0d1c1a' roughness={0.34} metalness={0.08} />
      </mesh>
      <mesh position={[0, 1.62, 0.08]}>
        <boxGeometry args={[4.08, 2.6, 0.01]} />
        <meshStandardMaterial
          color={scenePalette.screenGlow}
          emissive={scenePalette.screenGlow}
          emissiveIntensity={0.12}
          transparent
          opacity={0.08}
        />
      </mesh>
      <mesh position={[0, 2.46, 0.085]}>
        <boxGeometry args={[4, 0.18, 0.01]} />
        <meshStandardMaterial color='#133230' roughness={0.4} metalness={0.12} />
      </mesh>
      {screenLines.map((line) => (
        <Text
          key={line.text}
          position={[-1.74, line.y, 0.09]}
          fontSize={0.16}
          maxWidth={3.5}
          anchorX='left'
          anchorY='middle'
          color={line.color}
        >
          {line.text}
        </Text>
      ))}
    </group>
  );
};

export const LaptopModel = () => {
  return (
    <group position={[0.2, deskTopY, -0.28]}>
      <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
        <boxGeometry args={[5.05, 0.16, 3.28]} />
        <meshStandardMaterial color={scenePalette.laptopBody} metalness={0.42} roughness={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.106, 0.08]}>
        <boxGeometry args={[4.72, 0.05, 2.54]} />
        <meshStandardMaterial color={scenePalette.keyboardDeck} metalness={0.16} roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.129, 0.02]}>
        <boxGeometry args={[4.22, 0.016, 2.22]} />
        <meshStandardMaterial color={scenePalette.keyWell} metalness={0.06} roughness={0.64} />
      </mesh>
      <KeyboardKeys />
      <RoundedBox args={[1.32, 0.018, 0.96]} radius={0.05} smoothness={4} position={[0, 0.139, 1.02]} castShadow receiveShadow>
        <meshStandardMaterial color={scenePalette.trackpad} metalness={0.26} roughness={0.24} />
      </RoundedBox>
      <RoundedBox args={[1.04, 0.004, 0.68]} radius={0.03} smoothness={4} position={[0, 0.146, 1.02]}>
        <meshStandardMaterial color={scenePalette.trackpadBorder} transparent opacity={0.18} metalness={0.14} roughness={0.18} />
      </RoundedBox>
      <mesh castShadow receiveShadow position={[0, 0.07, -1.56]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 5.05, 24]} />
        <meshStandardMaterial color={scenePalette.laptopShadow} metalness={0.28} roughness={0.24} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.02, -1.48]}>
        <boxGeometry args={[4.74, 0.04, 0.12]} />
        <meshStandardMaterial color={scenePalette.laptopRubber} roughness={0.8} metalness={0.04} />
      </mesh>

      <group position={[0, 0.11, -1.56]} rotation={[-0.34, 0, 0]}>
        <mesh castShadow receiveShadow position={[0, 1.62, -0.02]}>
          <boxGeometry args={[4.6, 3.04, 0.14]} />
          <meshStandardMaterial color={scenePalette.screenFrame} metalness={0.28} roughness={0.26} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 1.62, 0.04]}>
          <boxGeometry args={[4.32, 2.76, 0.02]} />
          <meshStandardMaterial color={scenePalette.screenBezel} metalness={0.06} roughness={0.42} />
        </mesh>
        <DeveloperScreen />
      </group>
    </group>
  );
};

export const WaterBottleModel = ({ supportRef }) => {
  return (
    <ContactAlignedGroup supportRef={supportRef} supportY={deskTopY} position={[4.9, 0, -0.95]} rotation={[0, 0.08, 0]}>
      <group>
        <mesh castShadow receiveShadow position={[0, 1.18, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 2.36, 32]} />
          <meshStandardMaterial
            color={scenePalette.bottleBody}
            emissive={scenePalette.screenPrompt}
            emissiveIntensity={0.04}
            transparent
            opacity={0.38}
            metalness={0.08}
            roughness={0.14}
          />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 2.45, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.24, 20]} />
          <meshStandardMaterial color={scenePalette.bottleCap} metalness={0.18} roughness={0.32} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 2.28, 0]}>
          <torusGeometry args={[0.2, 0.03, 10, 28]} />
          <meshStandardMaterial color={scenePalette.bottleRing} metalness={0.08} roughness={0.26} />
        </mesh>
      </group>
    </ContactAlignedGroup>
  );
};

const BookGeometry = () => {
  return (
    <group>
      <RoundedBox args={[2.36, 0.22, 1.78]} radius={0.06} smoothness={4} position={[0, 0.11, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={scenePalette.bookCover} metalness={0.16} roughness={0.56} />
      </RoundedBox>
      <RoundedBox args={[2.18, 0.1, 1.6]} radius={0.04} smoothness={4} position={[0.02, 0.18, 0.02]} castShadow receiveShadow>
        <meshStandardMaterial color={scenePalette.bookPages} metalness={0.04} roughness={0.74} />
      </RoundedBox>
      <mesh castShadow receiveShadow position={[1.09, 0.18, 0.02]}>
        <boxGeometry args={[0.03, 0.08, 1.42]} />
        <meshStandardMaterial color={scenePalette.pageEdge} metalness={0.02} roughness={0.76} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.02, 0.18, 0.76]}>
        <boxGeometry args={[1.98, 0.08, 0.03]} />
        <meshStandardMaterial color={scenePalette.pageEdge} metalness={0.02} roughness={0.76} />
      </mesh>
      <mesh castShadow receiveShadow position={[-1.09, 0.12, 0]}>
        <boxGeometry args={[0.04, 0.18, 1.7]} />
        <meshStandardMaterial color='#123530' metalness={0.14} roughness={0.52} />
      </mesh>
    </group>
  );
};

const PenGeometry = () => {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.032, 0.032, 1.24, 18]} />
        <meshStandardMaterial color={scenePalette.penBody} metalness={0.28} roughness={0.22} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.034, 0.034, 0.08, 18]} />
        <meshStandardMaterial color={scenePalette.penBand} metalness={0.24} roughness={0.24} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.035, 0.038, 0.24, 18]} />
        <meshStandardMaterial color={scenePalette.penCap} metalness={0.24} roughness={0.28} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.56, 0]}>
        <sphereGeometry args={[0.032, 14, 14]} />
        <meshStandardMaterial color={scenePalette.penCap} metalness={0.22} roughness={0.26} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.04, 0.28, 0]} rotation={[0, 0, -0.24]}>
        <boxGeometry args={[0.02, 0.22, 0.05]} />
        <meshStandardMaterial color={scenePalette.penBand} metalness={0.18} roughness={0.28} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.58, 0]}>
        <coneGeometry args={[0.022, 0.13, 16]} />
        <meshStandardMaterial color={scenePalette.penBody} metalness={0.34} roughness={0.18} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.675, 0]}>
        <coneGeometry args={[0.008, 0.06, 12]} />
        <meshStandardMaterial color={scenePalette.penTip} metalness={0.46} roughness={0.2} />
      </mesh>
    </group>
  );
};

export const NotebookModel = ({ supportRef }) => {
  return (
    <ContactAlignedGroup supportRef={supportRef} supportY={deskTopY} position={[-4.02, 0, 1.38]} rotation={[0, 0.18, 0]}>
      <BookGeometry />
    </ContactAlignedGroup>
  );
};

export const PenModel = ({ supportRef }) => {
  return (
    <ContactAlignedGroup
      supportRef={supportRef}
      supportY={deskTopY}
      clearance={0.008}
      position={[-3.82, 0, 1.02]}
      rotation={[0.14, 0.2, 0.98]}
    >
      <PenGeometry />
    </ContactAlignedGroup>
  );
};

const Steam = () => {
  const streamRefs = useRef([]);
  const curves = useMemo(
    () => [
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.07, 0, 0.03),
        new THREE.Vector3(-0.1, 0.26, 0.05),
        new THREE.Vector3(-0.02, 0.58, 0.02),
        new THREE.Vector3(-0.08, 0.92, 0.08),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.05, 0.24, -0.01),
        new THREE.Vector3(-0.02, 0.56, 0.03),
        new THREE.Vector3(0.04, 0.9, 0.06),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.08, 0, -0.02),
        new THREE.Vector3(0.12, 0.3, -0.04),
        new THREE.Vector3(0.06, 0.62, 0.02),
        new THREE.Vector3(0.1, 0.94, 0.04),
      ]),
    ],
    []
  );

  useFrame((state) => {
    streamRefs.current.forEach((stream, index) => {
      if (!stream || !stream.material) {
        return;
      }

      const phase = state.clock.elapsedTime * 0.8 + index * 1.35;
      stream.position.x = Math.sin(phase) * 0.015;
      stream.position.z = Math.cos(phase * 0.85) * 0.015;
      stream.rotation.y = Math.sin(phase * 0.7) * 0.12;
      stream.material.opacity = 0.12 + Math.sin(phase) * 0.02;
    });
  });

  return (
    <group position={[0, 0.54, 0]}>
      {curves.map((curve, index) => (
        <mesh
          key={`steam-${index}`}
          ref={(node) => {
            streamRefs.current[index] = node;
          }}
        >
          <tubeGeometry args={[curve, 28, 0.018, 10, false]} />
          <meshStandardMaterial
            color={scenePalette.steam}
            emissive={scenePalette.steam}
            emissiveIntensity={0.05}
            transparent
            opacity={0.12}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

export const CoffeeMugModel = ({ supportRef }) => {
  return (
    <ContactAlignedGroup supportRef={supportRef} supportY={deskTopY} position={[-2.5, 0, 1.62]} rotation={[0, -0.08, 0]}>
      <group>
        <mesh castShadow receiveShadow position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.37, 0.35, 0.58, 28, 1, true]} />
          <meshStandardMaterial color={scenePalette.mugBody} metalness={0.08} roughness={0.34} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.29, 0.31, 0.06, 28]} />
          <meshStandardMaterial color={scenePalette.mugBody} metalness={0.08} roughness={0.34} />
        </mesh>
        <mesh position={[0, 0.56, 0]}>
          <torusGeometry args={[0.34, 0.025, 12, 36]} />
          <meshStandardMaterial color={scenePalette.mugBody} metalness={0.08} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0.46, 0]}>
          <cylinderGeometry args={[0.27, 0.29, 0.05, 28]} />
          <meshStandardMaterial color={scenePalette.mugCoffee} metalness={0.14} roughness={0.18} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.4, 0.34, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.16, 0.035, 12, 28]} />
          <meshStandardMaterial color={scenePalette.mugBody} metalness={0.08} roughness={0.3} />
        </mesh>
        <Steam />
      </group>
    </ContactAlignedGroup>
  );
};

const PhoneGeometry = () => {
  return (
    <group>
      <RoundedBox args={[0.86, 0.088, 1.6]} radius={0.1} smoothness={6} position={[0, 0.044, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={scenePalette.phoneBody} metalness={0.32} roughness={0.18} />
      </RoundedBox>
      <RoundedBox args={[0.74, 0.014, 1.4]} radius={0.08} smoothness={4} position={[0, 0.086, 0]}>
        <meshStandardMaterial color={scenePalette.phoneScreen} emissive={scenePalette.phoneGlow} emissiveIntensity={0.13} metalness={0.12} roughness={0.16} />
      </RoundedBox>
      <RoundedBox args={[0.68, 0.004, 1.32]} radius={0.07} smoothness={4} position={[0, 0.095, 0]}>
        <meshStandardMaterial color={scenePalette.phoneGlass} transparent opacity={0.16} metalness={0.6} roughness={0.08} />
      </RoundedBox>
      <RoundedBox args={[0.18, 0.014, 0.36]} radius={0.04} smoothness={4} position={[-0.22, 0.092, -0.44]}>
        <meshStandardMaterial color={scenePalette.phoneCamera} metalness={0.24} roughness={0.18} />
      </RoundedBox>
      {[-0.28, -0.22, -0.16].map((x, index) => (
        <mesh key={`camera-${index}`} position={[x, 0.102, -0.44]}>
          <sphereGeometry args={[0.032, 16, 16]} />
          <meshStandardMaterial color='#203836' metalness={0.42} roughness={0.12} />
        </mesh>
      ))}
    </group>
  );
};

export const PhoneModel = ({ supportRef }) => {
  return (
    <ContactAlignedGroup supportRef={supportRef} supportY={deskTopY} position={[4.12, 0, 1.62]} rotation={[0.08, 0.34, 0.16]}>
      <PhoneGeometry />
    </ContactAlignedGroup>
  );
};

const MouseGeometry = () => {
  return (
    <group>
      <RoundedBox args={[0.82, 0.22, 1.2]} radius={0.25} smoothness={5} position={[0, 0.11, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={scenePalette.mouseBody} metalness={0.24} roughness={0.26} />
      </RoundedBox>
      <RoundedBox args={[0.74, 0.08, 0.84]} radius={0.19} smoothness={4} position={[0, 0.19, -0.05]}>
        <meshStandardMaterial color={scenePalette.mouseGrip} metalness={0.12} roughness={0.34} />
      </RoundedBox>
      <mesh castShadow receiveShadow position={[0, 0.22, -0.3]}>
        <boxGeometry args={[0.04, 0.06, 0.18]} />
        <meshStandardMaterial color={scenePalette.mouseWheel} emissive={scenePalette.mouseWheel} emissiveIntensity={0.12} metalness={0.24} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.2, -0.04]}>
        <boxGeometry args={[0.02, 0.012, 0.78]} />
        <meshStandardMaterial color='#0a1211' metalness={0.08} roughness={0.46} />
      </mesh>
    </group>
  );
};

export const MouseModel = ({ supportRef }) => {
  return (
    <ContactAlignedGroup supportRef={supportRef} supportY={deskTopY} position={[2.18, 0, 1.26]} rotation={[0.02, -0.44, 0.02]}>
      <MouseGeometry />
    </ContactAlignedGroup>
  );
};

const HeadphonesGeometry = () => {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.7, 0]}>
        <torusGeometry args={[0.62, 0.08, 14, 38, Math.PI]} />
        <meshStandardMaterial color={scenePalette.headphonesBand} metalness={0.24} roughness={0.28} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.56, 0.34, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.36, 24]} />
        <meshStandardMaterial color={scenePalette.headphonesCup} metalness={0.3} roughness={0.22} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.56, 0.34, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.36, 24]} />
        <meshStandardMaterial color={scenePalette.headphonesCup} metalness={0.3} roughness={0.22} />
      </mesh>
      <mesh position={[-0.56, 0.34, 0.13]}>
        <cylinderGeometry args={[0.13, 0.13, 0.08, 18]} />
        <meshStandardMaterial color={scenePalette.headphonesPad} metalness={0.08} roughness={0.56} />
      </mesh>
      <mesh position={[0.56, 0.34, 0.13]}>
        <cylinderGeometry args={[0.13, 0.13, 0.08, 18]} />
        <meshStandardMaterial color={scenePalette.headphonesPad} metalness={0.08} roughness={0.56} />
      </mesh>
      <mesh position={[0, 0.72, 0.04]}>
        <torusGeometry args={[0.5, 0.018, 10, 32, Math.PI]} />
        <meshStandardMaterial color={scenePalette.headphonesAccent} emissive={scenePalette.headphonesAccent} emissiveIntensity={0.08} metalness={0.14} roughness={0.24} />
      </mesh>
    </group>
  );
};

export const HeadphonesModel = ({ supportRef }) => {
  return (
    <ContactAlignedGroup supportRef={supportRef} supportY={deskTopY} position={[-1.52, 0, -1.22]} rotation={[0, 0.52, 0]}>
      <HeadphonesGeometry />
    </ContactAlignedGroup>
  );
};

export const DeskBaseModel = () => {
  return (
    <>
      <mesh castShadow receiveShadow position={[0, -0.18, 0]}>
        <boxGeometry args={[13.2, 0.36, 7.1]} />
        <meshStandardMaterial color={scenePalette.deskTop} metalness={0.22} roughness={0.56} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.4, 0.15]}>
        <boxGeometry args={[13.4, 0.16, 7.34]} />
        <meshStandardMaterial color={scenePalette.deskEdge} metalness={0.12} roughness={0.68} />
      </mesh>
      <mesh receiveShadow position={[0.65, 0.01, 0.9]}>
        <boxGeometry args={[3.9, 0.02, 1.96]} />
        <meshStandardMaterial color={scenePalette.deskInset} metalness={0.08} roughness={0.54} />
      </mesh>
    </>
  );
};

const DeskScene = ({ isMobile }) => {
  const deskSceneRef = useRef(null);
  const scale = isMobile ? 0.56 : 0.8;
  const position = isMobile ? [0, -3.85, -0.75] : [3.25, -3.92, -1.35];
  const rotation = isMobile ? [0.03, -0.12, -0.01] : [0.03, -0.28, -0.01];

  return (
    <group ref={deskSceneRef} scale={scale} position={position} rotation={rotation}>
      <DeskBaseModel />

      <LaptopModel />
      <WaterBottleModel supportRef={deskSceneRef} />
      <NotebookModel supportRef={deskSceneRef} />
      <PenModel supportRef={deskSceneRef} />
      <CoffeeMugModel supportRef={deskSceneRef} />
      <PhoneModel supportRef={deskSceneRef} />
      <MouseModel supportRef={deskSceneRef} />
      <HeadphonesModel supportRef={deskSceneRef} />
    </group>
  );
};

const LaptopScene = ({ isMobile }) => {
  return (
    <group>
      <ambientLight intensity={0.42} />
      <hemisphereLight intensity={0.36} color='#e8fffb' groundColor='#04110f' />
      <spotLight
        position={[13, 16, 11]}
        angle={0.34}
        penumbra={0.8}
        intensity={2.2}
        castShadow
        shadow-mapSize={2048}
      />
      <pointLight position={[-7, 4.6, 7]} intensity={0.95} color='#9ff8ed' />
      <pointLight position={[7, 5.1, -6]} intensity={0.68} color='#1ca398' />
      <DeskScene isMobile={isMobile} />
    </group>
  );
};

const LaptopCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop='always'
      shadows
      dpr={[1, 2]}
      camera={{
        position: isMobile ? [11.5, 5.2, 13.5] : [12.6, 5.2, 14.8],
        fov: isMobile ? 28 : 24,
      }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          target={isMobile ? [0, -1.7, 0.1] : [2.8, -1.7, 0.1]}
          minAzimuthAngle={-Math.PI / 2.1}
          maxAzimuthAngle={Math.PI / 4}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 1.9}
        />
        <LaptopScene isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default LaptopCanvas;
