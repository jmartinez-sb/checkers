import type { CheckerPiece, Position } from '../types';

export const isValidPosition = (position: Position): boolean => {
  return position.row >= 0 && position.row < 8 && position.col >= 0 && position.col < 8;
};

export const isPositionOccupied = (
  position: Position, 
  checkers: CheckerPiece[]
): boolean => {
  return checkers.some(
    checker => checker.position.row === position.row && checker.position.col === position.col
  );
};

export const getCheckerAtPosition = (
  position: Position, 
  checkers: CheckerPiece[]
): CheckerPiece | undefined => {
  return checkers.find(
    checker => checker.position.row === position.row && checker.position.col === position.col
  );
};

export const getSimpleMoves = (
  checker: CheckerPiece,
  checkers: CheckerPiece[]
): Position[] => {
  const moves: Position[] = [];
  const { row, col } = checker.position;
  
  const blackDirections = [
    { row: 1, col: -1 },
    { row: 1, col: 1 }
  ];
  
  const whiteDirections = [
    { row: -1, col: -1 },
    { row: -1, col: 1 }
  ];
  
  const kingDirections = [
    ...blackDirections,
    ...whiteDirections
  ];
  
  const directions = checker.isKing 
    ? kingDirections 
    : checker.isBlackTeam 
      ? blackDirections 
      : whiteDirections;
  
  // Fichas normales: solo 1 casilla
  if (!checker.isKing) {
    for (const direction of directions) {
      const newPosition: Position = {
        row: row + direction.row,
        col: col + direction.col
      };
      
      if (isValidPosition(newPosition) && !isPositionOccupied(newPosition, checkers)) {
        moves.push(newPosition);
      }
    }
    return moves;
  }
  
  for (const direction of kingDirections) {
    let distance = 1;
    
    while (true) {
      const newPosition: Position = {
        row: row + (direction.row * distance),
        col: col + (direction.col * distance)
      };
      
      if (!isValidPosition(newPosition)) break;
      
      if (isPositionOccupied(newPosition, checkers)) break;
      
      moves.push(newPosition);
      distance++;
    }
  }
  
  return moves;
};

export const getCaptureMoves = (
  checker: CheckerPiece,
  checkers: CheckerPiece[],
  excludeCaptured: Position[] = []
): Position[] => {
  const captures: Position[] = [];
  const { row, col } = checker.position;
  
  const allDirections = [
    { row: 1, col: -1 },
    { row: 1, col: 1 },
    { row: -1, col: -1 },
    { row: -1, col: 1 }
  ];
  
  for (const direction of allDirections) {
    if (!checker.isKing) {
      const enemyPosition: Position = {
        row: row + direction.row,
        col: col + direction.col
      };
      
      const landingPosition: Position = {
        row: row + direction.row * 2,
        col: col + direction.col * 2
      };
      
      if (checker.isBlackTeam && direction.row < 0) continue;
      if (!checker.isBlackTeam && direction.row > 0) continue;
      
      if (!isValidPosition(landingPosition)) continue;
      if (isPositionOccupied(landingPosition, checkers)) continue;
      
      const enemyChecker = getCheckerAtPosition(enemyPosition, checkers);
      
      const isAlreadyCaptured = excludeCaptured.some(
        pos => pos.row === enemyPosition.row && pos.col === enemyPosition.col
      );
      
      if (enemyChecker && 
          enemyChecker.isBlackTeam !== checker.isBlackTeam && 
          !isAlreadyCaptured) {
        captures.push(landingPosition);
      }
    } else {
      let distance = 1;
      let foundEnemy = false;
      
      while (true) {
        const currentPosition: Position = {
          row: row + (direction.row * distance),
          col: col + (direction.col * distance)
        };
        
        if (!isValidPosition(currentPosition)) break;
        
        const pieceAtPosition = getCheckerAtPosition(currentPosition, checkers);
        
        if (pieceAtPosition) {
          if (foundEnemy) break;
          
          if (pieceAtPosition.isBlackTeam !== checker.isBlackTeam) {
            const isAlreadyCaptured = excludeCaptured.some(
              pos => pos.row === currentPosition.row && pos.col === currentPosition.col
            );
            
            if (isAlreadyCaptured) break;
            
            foundEnemy = true;
          } else {
            break;
          }
        } else if (foundEnemy) {
          captures.push(currentPosition);
        }
        
        distance++;
      }
    }
  }
  
  return captures;
};

export const getValidMoves = (
  checker: CheckerPiece,
  checkers: CheckerPiece[]
): Position[] => {
  const captures = getCaptureMoves(checker, checkers);
  
  if (captures.length > 0) {
    return captures;
  }
  
  return getSimpleMoves(checker, checkers);
};

export const isCapture = (from: Position, to: Position): boolean => {
  const rowDiff = Math.abs(from.row - to.row);
  const colDiff = Math.abs(from.col - to.col);
  return rowDiff >= 2 && colDiff >= 2 && rowDiff === colDiff;
};

export const getCapturedPosition = (
  from: Position, 
  to: Position, 
  checkers: CheckerPiece[],
  isKing: boolean
): Position | null => {
  if (!isCapture(from, to)) return null;
  
  const rowDirection = to.row > from.row ? 1 : -1;
  const colDirection = to.col > from.col ? 1 : -1;
  
  if (!isKing) {
    return {
      row: (from.row + to.row) / 2,
      col: (from.col + to.col) / 2
    };
  }
  
  let distance = 1;
  while (true) {
    const checkPosition: Position = {
      row: from.row + (rowDirection * distance),
      col: from.col + (colDirection * distance)
    };
    
    if (checkPosition.row === to.row && checkPosition.col === to.col) {
      return null;
    }
    
    const pieceAtPosition = getCheckerAtPosition(checkPosition, checkers);
    if (pieceAtPosition) {
      return checkPosition;
    }
    
    distance++;
  }
};

export const shouldPromoteToKing = (checker: CheckerPiece): boolean => {
  if (checker.isKing) return false;
  
  if (checker.isBlackTeam && checker.position.row === 7) return true;
  
  if (!checker.isBlackTeam && checker.position.row === 0) return true;
  
  return false;
};

export const hasValidMoves = (
  checkers: CheckerPiece[],
  isBlackTeam: boolean
): boolean => {
  const teamCheckers = checkers.filter(c => c.isBlackTeam === isBlackTeam);
  
  for (const checker of teamCheckers) {
    const moves = getValidMoves(checker, checkers);
    if (moves.length > 0) {
      return true;
    }
  }
  
  return false;
};

export const checkWinner = (
  checkers: CheckerPiece[],
  currentTurn: 'black' | 'white'
): 'black' | 'white' | null => {
  const blackCheckers = checkers.filter(c => c.isBlackTeam);
  const whiteCheckers = checkers.filter(c => !c.isBlackTeam);
  
  if (blackCheckers.length === 0) return 'white';
  if (whiteCheckers.length === 0) return 'black';
  
  if (currentTurn === 'black') {
    if (!hasValidMoves(checkers, true)) return 'white';
  } else {
    if (!hasValidMoves(checkers, false)) return 'black';
  }
  
  return null;
};
