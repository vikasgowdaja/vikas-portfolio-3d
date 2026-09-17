import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";

import CanvasLoader from "../Loader";

const squareSize = 0.72;
const boardBaseHeight = 0.24;
const boardInsetHeight = 0.12;
const pieceBaseY = 0.18;
const backRank = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
const rookDirections = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];
const bishopDirections = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];
const knightOffsets = [
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1],
  [1, 2],
  [1, -2],
  [-1, 2],
  [-1, -2],
];
const kingOffsets = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];
const homeRow = {
  light: 0,
  dark: 7,
};
const pawnStartRow = {
  light: 1,
  dark: 6,
};
const promotionRow = {
  light: 7,
  dark: 0,
};

const boardCoordinate = (index) => (index - 3.5) * squareSize;
const squareKey = (row, col) => `${row}-${col}`;
const isInBounds = (row, col) => row >= 0 && row < 8 && col >= 0 && col < 8;
const oppositeSide = (side) => (side === "light" ? "dark" : "light");
const displaySide = (side) => (side === "light" ? "White" : "Black");
const toSquareName = (row, col) => `${String.fromCharCode(97 + col)}${row + 1}`;

const boardSquares = Array.from({ length: 64 }, (_, index) => {
  const row = Math.floor(index / 8);
  const column = index % 8;

  return {
    key: `${row}-${column}`,
    row,
    col: column,
    isLight: (row + column) % 2 === 0,
    position: [boardCoordinate(column), boardInsetHeight, boardCoordinate(row)],
  };
});

const createInitialPieces = () =>
  backRank.flatMap((type, column) => [
    {
      id: `light-back-${column}`,
      type,
      side: "light",
      row: homeRow.light,
      col: column,
      hasMoved: false,
    },
    {
      id: `light-pawn-${column}`,
      type: "pawn",
      side: "light",
      row: pawnStartRow.light,
      col: column,
      hasMoved: false,
    },
    {
      id: `dark-pawn-${column}`,
      type: "pawn",
      side: "dark",
      row: pawnStartRow.dark,
      col: column,
      hasMoved: false,
    },
    {
      id: `dark-back-${column}`,
      type,
      side: "dark",
      row: homeRow.dark,
      col: column,
      hasMoved: false,
    },
  ]);

const buildPieceMap = (pieces) => {
  const pieceMap = new Map();

  pieces.forEach((piece) => {
    pieceMap.set(squareKey(piece.row, piece.col), piece);
  });

  return pieceMap;
};

const getPieceAt = (pieceMap, row, col) => pieceMap.get(squareKey(row, col));

const collectSlidingMoves = (piece, pieceMap, directions) => {
  const moves = [];

  directions.forEach(([rowStep, colStep]) => {
    let row = piece.row + rowStep;
    let col = piece.col + colStep;

    while (isInBounds(row, col)) {
      const occupant = getPieceAt(pieceMap, row, col);

      if (!occupant) {
        moves.push({ row, col });
      } else {
        if (occupant.side !== piece.side) {
          moves.push({ row, col, captureId: occupant.id });
        }
        break;
      }

      row += rowStep;
      col += colStep;
    }
  });

  return moves;
};

const collectSlidingAttacks = (piece, pieceMap, directions) => {
  const attacks = [];

  directions.forEach(([rowStep, colStep]) => {
    let row = piece.row + rowStep;
    let col = piece.col + colStep;

    while (isInBounds(row, col)) {
      attacks.push({ row, col });

      if (getPieceAt(pieceMap, row, col)) {
        break;
      }

      row += rowStep;
      col += colStep;
    }
  });

  return attacks;
};

const getPawnMoves = (piece, pieceMap, lastMove) => {
  const direction = piece.side === "light" ? 1 : -1;
  const moves = [];
  const forwardRow = piece.row + direction;

  if (isInBounds(forwardRow, piece.col) && !getPieceAt(pieceMap, forwardRow, piece.col)) {
    moves.push({ row: forwardRow, col: piece.col });

    const doubleRow = piece.row + direction * 2;
    if (
      piece.row === pawnStartRow[piece.side] &&
      isInBounds(doubleRow, piece.col) &&
      !getPieceAt(pieceMap, doubleRow, piece.col)
    ) {
      moves.push({ row: doubleRow, col: piece.col });
    }
  }

  [-1, 1].forEach((colOffset) => {
    const targetCol = piece.col + colOffset;
    if (!isInBounds(forwardRow, targetCol)) {
      return;
    }

    const occupant = getPieceAt(pieceMap, forwardRow, targetCol);
    if (occupant && occupant.side !== piece.side) {
      moves.push({ row: forwardRow, col: targetCol, captureId: occupant.id });
    }
  });

  if (
    lastMove &&
    lastMove.type === "pawn" &&
    Math.abs(lastMove.from.row - lastMove.to.row) === 2 &&
    lastMove.to.row === piece.row &&
    Math.abs(lastMove.to.col - piece.col) === 1
  ) {
    const adjacentPawn = getPieceAt(pieceMap, lastMove.to.row, lastMove.to.col);
    const targetRow = piece.row + direction;

    if (
      adjacentPawn &&
      adjacentPawn.id === lastMove.pieceId &&
      adjacentPawn.side !== piece.side &&
      isInBounds(targetRow, lastMove.to.col) &&
      !getPieceAt(pieceMap, targetRow, lastMove.to.col)
    ) {
      moves.push({
        row: targetRow,
        col: lastMove.to.col,
        captureId: adjacentPawn.id,
        isEnPassant: true,
      });
    }
  }

  return moves;
};

const getKnightMoves = (piece, pieceMap) =>
  knightOffsets.reduce((moves, [rowOffset, colOffset]) => {
    const row = piece.row + rowOffset;
    const col = piece.col + colOffset;

    if (!isInBounds(row, col)) {
      return moves;
    }

    const occupant = getPieceAt(pieceMap, row, col);
    if (!occupant || occupant.side !== piece.side) {
      moves.push({ row, col, captureId: occupant?.id });
    }

    return moves;
  }, []);

const getKingStepMoves = (piece, pieceMap) =>
  kingOffsets.reduce((moves, [rowOffset, colOffset]) => {
    const row = piece.row + rowOffset;
    const col = piece.col + colOffset;

    if (!isInBounds(row, col)) {
      return moves;
    }

    const occupant = getPieceAt(pieceMap, row, col);
    if (!occupant || occupant.side !== piece.side) {
      moves.push({ row, col, captureId: occupant?.id });
    }

    return moves;
  }, []);

const getAttackTargets = (piece, pieceMap) => {
  if (piece.type === "pawn") {
    const direction = piece.side === "light" ? 1 : -1;

    return [-1, 1].reduce((attacks, colOffset) => {
      const row = piece.row + direction;
      const col = piece.col + colOffset;

      if (isInBounds(row, col)) {
        attacks.push({ row, col });
      }

      return attacks;
    }, []);
  }

  if (piece.type === "knight") {
    return knightOffsets.reduce((attacks, [rowOffset, colOffset]) => {
      const row = piece.row + rowOffset;
      const col = piece.col + colOffset;

      if (isInBounds(row, col)) {
        attacks.push({ row, col });
      }

      return attacks;
    }, []);
  }

  if (piece.type === "bishop") {
    return collectSlidingAttacks(piece, pieceMap, bishopDirections);
  }

  if (piece.type === "rook") {
    return collectSlidingAttacks(piece, pieceMap, rookDirections);
  }

  if (piece.type === "queen") {
    return collectSlidingAttacks(piece, pieceMap, [...rookDirections, ...bishopDirections]);
  }

  return kingOffsets.reduce((attacks, [rowOffset, colOffset]) => {
    const row = piece.row + rowOffset;
    const col = piece.col + colOffset;

    if (isInBounds(row, col)) {
      attacks.push({ row, col });
    }

    return attacks;
  }, []);
};

const isSquareAttacked = (row, col, attackingSide, pieces) => {
  const pieceMap = buildPieceMap(pieces);

  return pieces
    .filter((piece) => piece.side === attackingSide)
    .some((piece) =>
      getAttackTargets(piece, pieceMap).some(
        (target) => target.row === row && target.col === col
      )
    );
};

const isKingInCheck = (side, pieces) => {
  const king = pieces.find((piece) => piece.side === side && piece.type === "king");

  if (!king) {
    return false;
  }

  return isSquareAttacked(king.row, king.col, oppositeSide(side), pieces);
};

const getCastleMoves = (piece, pieces, pieceMap) => {
  if (piece.hasMoved || isKingInCheck(piece.side, pieces)) {
    return [];
  }

  return [
    {
      rookCol: 0,
      targetCol: 2,
      rookToCol: 3,
      betweenCols: [1, 2, 3],
      travelCols: [3, 2],
    },
    {
      rookCol: 7,
      targetCol: 6,
      rookToCol: 5,
      betweenCols: [5, 6],
      travelCols: [5, 6],
    },
  ].reduce((moves, castle) => {
    const rook = getPieceAt(pieceMap, piece.row, castle.rookCol);

    if (!rook || rook.type !== "rook" || rook.side !== piece.side || rook.hasMoved) {
      return moves;
    }

    if (castle.betweenCols.some((col) => getPieceAt(pieceMap, piece.row, col))) {
      return moves;
    }

    if (
      castle.travelCols.some((col) =>
        isSquareAttacked(piece.row, col, oppositeSide(piece.side), pieces)
      )
    ) {
      return moves;
    }

    moves.push({
      row: piece.row,
      col: castle.targetCol,
      isCastle: true,
      rookId: rook.id,
      rookToCol: castle.rookToCol,
    });

    return moves;
  }, []);
};

const getCandidateMoves = (piece, pieces, lastMove) => {
  const pieceMap = buildPieceMap(pieces);

  if (piece.type === "pawn") {
    return getPawnMoves(piece, pieceMap, lastMove);
  }

  if (piece.type === "knight") {
    return getKnightMoves(piece, pieceMap);
  }

  if (piece.type === "bishop") {
    return collectSlidingMoves(piece, pieceMap, bishopDirections);
  }

  if (piece.type === "rook") {
    return collectSlidingMoves(piece, pieceMap, rookDirections);
  }

  if (piece.type === "queen") {
    return collectSlidingMoves(piece, pieceMap, [...rookDirections, ...bishopDirections]);
  }

  return [...getKingStepMoves(piece, pieceMap), ...getCastleMoves(piece, pieces, pieceMap)];
};

const applyMove = (pieces, movingPiece, move) =>
  pieces
    .filter((piece) => piece.id !== move.captureId)
    .map((piece) => {
      if (piece.id === movingPiece.id) {
        return {
          ...piece,
          row: move.row,
          col: move.col,
          hasMoved: true,
          type:
            movingPiece.type === "pawn" && move.row === promotionRow[movingPiece.side]
              ? "queen"
              : piece.type,
        };
      }

      if (move.isCastle && piece.id === move.rookId) {
        return {
          ...piece,
          col: move.rookToCol,
          hasMoved: true,
        };
      }

      return piece;
    });

const getLegalMoves = (piece, pieces, lastMove) =>
  getCandidateMoves(piece, pieces, lastMove).filter((move) => {
    const nextPieces = applyMove(pieces, piece, move);
    return !isKingInCheck(piece.side, nextPieces);
  });

const PieceMaterial = ({ color, accent, emphasis = 1 }) => (
  <meshStandardMaterial
    color={color}
    roughness={0.35}
    metalness={0.18}
    emissive={accent}
    emissiveIntensity={0.08 * emphasis}
  />
);

const ChessPiece = ({ piece, isSelected, isCaptureTarget, onSelect }) => {
  const { type, side, row, col } = piece;
  const color = side === "light" ? "#f2fdf9" : "#051b18";
  const accent = isSelected ? "#5adfd3" : side === "light" ? "#b7f6ee" : "#16998d";
  const emphasis = isSelected || isCaptureTarget ? 2.1 : 1;
  const rotationY =
    type === "knight" ? (side === "light" ? Math.PI / 7 : Math.PI + Math.PI / 7) : 0;
  const position = [
    boardCoordinate(col),
    pieceBaseY + (isSelected ? 0.07 : 0),
    boardCoordinate(row),
  ];

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      scale={isSelected ? 1.05 : 1}
      onPointerDown={onSelect}
    >
      <mesh position={[0, 0.64, 0]}>
        <cylinderGeometry args={[0.33, 0.33, 1.42, 20]} />
        <meshBasicMaterial transparent opacity={0.001} depthWrite={false} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.28, 0.32, 0.16, 32]} />
        <PieceMaterial color={color} accent={accent} emphasis={emphasis} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 0.14, 32]} />
        <PieceMaterial color={color} accent={accent} emphasis={emphasis} />
      </mesh>

      {type === "pawn" && (
        <>
          <mesh castShadow receiveShadow position={[0, 0.43, 0]}>
            <cylinderGeometry args={[0.11, 0.15, 0.24, 24]} />
            <PieceMaterial color={color} accent={accent} emphasis={emphasis} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.62, 0]}>
            <sphereGeometry args={[0.15, 24, 24]} />
            <PieceMaterial color={color} accent={accent} emphasis={emphasis} />
          </mesh>
        </>
      )}

      {type === "rook" && (
        <>
          <mesh castShadow receiveShadow position={[0, 0.52, 0]}>
            <cylinderGeometry args={[0.16, 0.18, 0.48, 24]} />
            <PieceMaterial color={color} accent={accent} emphasis={emphasis} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.83, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.12, 24]} />
            <PieceMaterial color={color} accent={accent} emphasis={emphasis} />
          </mesh>
          {[
            [0.14, 0.94, 0.14],
            [-0.14, 0.94, 0.14],
            [0.14, 0.94, -0.14],
            [-0.14, 0.94, -0.14],
          ].map((battlement, index) => (
            <mesh key={`rook-top-${index}`} castShadow receiveShadow position={battlement}>
              <boxGeometry args={[0.1, 0.14, 0.1]} />
              <PieceMaterial color={color} accent={accent} emphasis={emphasis} />
            </mesh>
          ))}
        </>
      )}

      {type === "knight" && (
        <>
          <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.12, 0.17, 0.28, 24]} />
            <PieceMaterial color={color} accent={accent} emphasis={emphasis} />
          </mesh>
          <mesh castShadow receiveShadow position={[0.03, 0.78, 0]} rotation={[0, 0, -0.24]}>
            <boxGeometry args={[0.2, 0.42, 0.14]} />
            <PieceMaterial color={color} accent={accent} emphasis={emphasis} />
          </mesh>
          <mesh castShadow receiveShadow position={[0.09, 1.02, 0]} rotation={[0, 0, 0.62]}>
            <coneGeometry args={[0.11, 0.3, 6]} />
            <PieceMaterial color={color} accent={accent} emphasis={emphasis} />
          </mesh>
        </>
      )}

      {type === "bishop" && (
        <>
          <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.12, 0.17, 0.36, 24]} />
            <PieceMaterial color={color} accent={accent} emphasis={emphasis} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.15, 24, 24]} />
            <PieceMaterial color={color} accent={accent} emphasis={emphasis} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 1.03, 0]}>
            <coneGeometry args={[0.09, 0.28, 16]} />
            <PieceMaterial color={color} accent={accent} emphasis={emphasis} />
          </mesh>
        </>
      )}

      {type === "queen" && (
        <>
          <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.13, 0.18, 0.46, 24]} />
            <PieceMaterial color={color} accent={accent} emphasis={emphasis} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.87, 0]}>
            <torusGeometry args={[0.11, 0.025, 12, 32]} />
            <PieceMaterial color={color} accent={accent} emphasis={emphasis} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 1.03, 0]}>
            <sphereGeometry args={[0.14, 24, 24]} />
            <PieceMaterial color={color} accent={accent} emphasis={emphasis} />
          </mesh>
          {[
            [0, 1.23, 0],
            [0.11, 1.17, 0],
            [-0.11, 1.17, 0],
          ].map((crownPoint, index) => (
            <mesh key={`queen-crown-${index}`} castShadow receiveShadow position={crownPoint}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <PieceMaterial color={color} accent={accent} emphasis={emphasis} />
            </mesh>
          ))}
        </>
      )}

      {type === "king" && (
        <>
          <mesh castShadow receiveShadow position={[0, 0.58, 0]}>
            <cylinderGeometry args={[0.13, 0.18, 0.5, 24]} />
            <PieceMaterial color={color} accent={accent} emphasis={emphasis} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.93, 0]}>
            <sphereGeometry args={[0.13, 24, 24]} />
            <PieceMaterial color={color} accent={accent} emphasis={emphasis} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 1.17, 0]}>
            <boxGeometry args={[0.08, 0.28, 0.08]} />
            <PieceMaterial color={color} accent={accent} emphasis={emphasis} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 1.23, 0]}>
            <boxGeometry args={[0.22, 0.07, 0.08]} />
            <PieceMaterial color={color} accent={accent} emphasis={emphasis} />
          </mesh>
        </>
      )}
    </group>
  );
};

const ChessBoard = ({ onStatusChange }) => {
  const [pieces, setPieces] = useState(createInitialPieces);
  const [activeSide, setActiveSide] = useState("light");
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [lastMove, setLastMove] = useState(null);

  const selectedPiece = pieces.find((piece) => piece.id === selectedPieceId) ?? null;
  const legalMoves =
    selectedPiece && selectedPiece.side === activeSide
      ? getLegalMoves(selectedPiece, pieces, lastMove)
      : [];
  const legalMoveMap = new Map(
    legalMoves.map((move) => [squareKey(move.row, move.col), move])
  );
  const currentSidePieces = pieces.filter((piece) => piece.side === activeSide);
  const hasAvailableMove = currentSidePieces.some(
    (piece) => getLegalMoves(piece, pieces, lastMove).length > 0
  );
  const inCheck = isKingInCheck(activeSide, pieces);
  const statusLine = !hasAvailableMove
    ? inCheck
      ? `${displaySide(activeSide)} is checkmated`
      : "Stalemate"
    : `${displaySide(activeSide)} to move${inCheck ? " - check" : ""}`;
  const instructionLine = selectedPiece
    ? `${displaySide(selectedPiece.side)} ${selectedPiece.type} on ${toSquareName(
        selectedPiece.row,
        selectedPiece.col
      )}${legalMoves.length ? ` - ${legalMoves.length} legal moves` : ""}`
    : "Click a piece, then a highlighted square";

  useEffect(() => {
    onStatusChange({
      statusLine,
      instructionLine,
    });
  }, [instructionLine, onStatusChange, statusLine]);

  const commitMove = (movingPiece, move) => {
    const nextPieces = applyMove(pieces, movingPiece, move);

    setPieces(nextPieces);
    setLastMove({
      pieceId: movingPiece.id,
      side: movingPiece.side,
      type: movingPiece.type,
      from: {
        row: movingPiece.row,
        col: movingPiece.col,
      },
      to: {
        row: move.row,
        col: move.col,
      },
    });
    setActiveSide(oppositeSide(movingPiece.side));
    setSelectedPieceId(null);
  };

  const handlePieceClick = (event, piece) => {
    event.stopPropagation();

    if (!hasAvailableMove) {
      return;
    }

    if (!selectedPiece) {
      if (piece.side === activeSide) {
        setSelectedPieceId(piece.id);
      }
      return;
    }

    if (piece.id === selectedPiece.id) {
      setSelectedPieceId(null);
      return;
    }

    const targetMove = legalMoveMap.get(squareKey(piece.row, piece.col));

    if (targetMove && piece.side !== selectedPiece.side) {
      commitMove(selectedPiece, targetMove);
      return;
    }

    if (piece.side === activeSide) {
      setSelectedPieceId(piece.id);
      return;
    }

    setSelectedPieceId(null);
  };

  const handleSquareClick = (event, square) => {
    event.stopPropagation();

    if (!selectedPiece) {
      return;
    }

    const targetMove = legalMoveMap.get(squareKey(square.row, square.col));

    if (targetMove) {
      commitMove(selectedPiece, targetMove);
      return;
    }

    setSelectedPieceId(null);
  };

  return (
    <group rotation={[0, Math.PI / 4, 0]}>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[6.3, boardBaseHeight, 6.3]} />
        <meshStandardMaterial color='#051614' metalness={0.25} roughness={0.55} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, boardInsetHeight / 2 + 0.02, 0]}>
        <boxGeometry args={[5.96, boardInsetHeight, 5.96]} />
        <meshStandardMaterial color='#0d3733' metalness={0.2} roughness={0.52} />
      </mesh>

      {boardSquares.map((square) => {
        const isSelectedSquare =
          selectedPiece?.row === square.row && selectedPiece?.col === square.col;
        const legalMove = legalMoveMap.get(squareKey(square.row, square.col));
        const isLastMoveSquare =
          lastMove &&
          ((lastMove.from.row === square.row && lastMove.from.col === square.col) ||
            (lastMove.to.row === square.row && lastMove.to.col === square.col));

        return (
        <mesh
          key={square.key}
          castShadow
          receiveShadow
          position={square.position}
          onPointerDown={(event) => handleSquareClick(event, square)}
        >
          <boxGeometry args={[squareSize, 0.06, squareSize]} />
          <meshStandardMaterial
            color={
              isSelectedSquare
                ? "#30c9bf"
                : legalMove
                  ? legalMove.captureId
                    ? "#52d9cd"
                    : "#98efe7"
                  : isLastMoveSquare
                    ? square.isLight
                      ? "#d8fbf6"
                      : "#208277"
                    : square.isLight
                      ? "#ecfcf8"
                      : "#1c6e64"
            }
            metalness={0.18}
            roughness={0.5}
          />
        </mesh>
        );
      })}

      {legalMoves.map((move) => (
        <mesh
          key={`legal-${move.row}-${move.col}`}
          position={[boardCoordinate(move.col), boardInsetHeight + 0.065, boardCoordinate(move.row)]}
        >
          <cylinderGeometry args={[move.captureId ? 0.19 : 0.12, move.captureId ? 0.19 : 0.12, 0.025, 24]} />
          <meshStandardMaterial
            color={move.captureId ? "#38cfc4" : "#9af3ea"}
            emissive={move.captureId ? "#16887d" : "#27c5bc"}
            emissiveIntensity={0.4}
            transparent
            opacity={0.92}
          />
        </mesh>
      ))}

      {pieces.map((piece) => (
        <ChessPiece
          key={piece.id}
          piece={piece}
          isSelected={piece.id === selectedPieceId}
          isCaptureTarget={Boolean(
            selectedPiece &&
              piece.side !== selectedPiece.side &&
              legalMoveMap.has(squareKey(piece.row, piece.col))
          )}
          onSelect={(event) => handlePieceClick(event, piece)}
        />
      ))}
    </group>
  );
};

const ChessboardCanvas = () => {
  const [status, setStatus] = useState({
    statusLine: "White to move",
    instructionLine: "Click a piece, then a highlighted square",
  });

  return (
    <div className='relative h-full w-full overflow-hidden rounded-2xl'>
      <Canvas
        shadows
        frameloop='demand'
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
        camera={{
          fov: 40,
          near: 0.1,
          far: 200,
          position: [8.8, 6.9, 8.8],
        }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <ambientLight intensity={0.75} />
          <hemisphereLight intensity={0.55} color='#c4fbf3' groundColor='#020d0c' />
          <directionalLight
            position={[6, 8, 5]}
            intensity={1.6}
            color='#f3fffc'
            castShadow
            shadow-mapSize={1024}
          />
          <pointLight position={[-4, 3, -4]} intensity={0.45} color='#2bc7be' />
          <OrbitControls
            enablePan={false}
            minDistance={8}
            maxDistance={14}
            maxPolarAngle={Math.PI / 2.15}
            minPolarAngle={Math.PI / 4}
          />
          <ChessBoard onStatusChange={setStatus} />

          <Preload all />
        </Suspense>
      </Canvas>

      <div className='pointer-events-none absolute left-4 bottom-4 max-w-[65%] rounded-2xl border border-[#97cfc733] bg-[#041715cc] px-4 py-3 backdrop-blur-sm'>
        <p className='text-sm font-semibold text-[#eefbf9]'>{status.statusLine}</p>
        <p className='mt-1 text-xs leading-5 text-[#9dd9d2]'>{status.instructionLine}</p>
      </div>
    </div>
  );
};

export default ChessboardCanvas;
