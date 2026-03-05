import { createContext, useContext, useState } from 'react';
import type { Game, CheckerPiece, Position } from './types';
import { 
  getValidMoves,
  getCaptureMoves,
  getCapturedPosition,
  shouldPromoteToKing,
  checkWinner
} from './utils/gameLogic';

const GameContext = createContext<Game | undefined>(undefined);
  
const setBlackCheckers = (): CheckerPiece[] => {
  const checkers: CheckerPiece[] = [];
  
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        checkers.push({
          id: `black-${row}-${col}`,
          position: { row, col },
          isBlackTeam: true,
          isKing: false
        });
      }
    }
  }
  
  return checkers;
};

const setWhiteCheckers = (): CheckerPiece[] => {
  const checkers: CheckerPiece[] = [];

  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        checkers.push({
          id: `white-${row}-${col}`,
          position: { row, col },
          isBlackTeam: false,
          isKing: false
        });
      }
    }
  }
  
  return checkers;
};

const initialCheckers = (): CheckerPiece[] => {
  return [
    ...setBlackCheckers(),
    ...setWhiteCheckers()
  ];
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [checkers, setCheckers] = useState<CheckerPiece[]>(initialCheckers());
  const [currentTurn, setCurrentTurn] = useState<'black' | 'white'>('black');
  const [selectedChecker, setSelectedChecker] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [winner, setWinner] = useState<'black' | 'white' | null>(null);

  const selectChecker = (id: string) => {
    const checker = checkers.find(checker => checker.id === id);
    if (!checker) return;
    
    if ((currentTurn === 'black' && !checker.isBlackTeam) || 
        (currentTurn === 'white' && checker.isBlackTeam)) {
      return;
    }
    
    setSelectedChecker(id);
    
    const moves = getValidMoves(checker, checkers);
    setValidMoves(moves);
  };

  const moveChecker = (id: string, newPosition: Position) => {
    const checker = checkers.find(c => c.id === id);
    if (!checker) return;
    
    // Obtener posición capturada (si existe)
    const capturedPos = getCapturedPosition(
      checker.position, 
      newPosition, 
      checkers,
      checker.isKing
    );
    
    setCheckers(previousCheckers => {
      let updatedCheckers = previousCheckers.map(currentChecker => {
        if (currentChecker.id === id) {
          const movedChecker = { ...currentChecker, position: newPosition };
          
          if (shouldPromoteToKing(movedChecker)) {
            return { ...movedChecker, isKing: true };
          }
          
          return movedChecker;
        }
        return currentChecker;
      });
      
      // Eliminar ficha capturada si existe
      if (capturedPos) {
        updatedCheckers = updatedCheckers.filter(
          c => !(c.position.row === capturedPos.row && c.position.col === capturedPos.col)
        );
      }
      
      return updatedCheckers;
    });
    
    // Verificar si hay capturas múltiples disponibles
    if (capturedPos) {
      const movedChecker = checkers.find(c => c.id === id);
      if (movedChecker) {
        const updatedChecker = { 
          ...movedChecker, 
          position: newPosition,
          isKing: shouldPromoteToKing({ ...movedChecker, position: newPosition }) || movedChecker.isKing
        };
        
        // Calcular fichas después de la captura actual
        const checkersAfterCapture = checkers
          .map(c => c.id === id ? updatedChecker : c)
          .filter(c => !(c.position.row === capturedPos.row && c.position.col === capturedPos.col));
        
        const additionalCaptures = getCaptureMoves(updatedChecker, checkersAfterCapture);
        
        if (additionalCaptures.length > 0) {
          // Hay más capturas disponibles - mantener el turno y la ficha seleccionada
          setSelectedChecker(id);
          setValidMoves(additionalCaptures);
          return; // No cambiar de turno
        }
      }
    }
    
    // No hay más capturas - fin del turno
    const nextTurn = currentTurn === 'black' ? 'white' : 'black';
    setSelectedChecker(null);
    setValidMoves([]);
    setCurrentTurn(nextTurn);
    
    setTimeout(() => {
      const updatedCheckers = checkers
        .map(c => c.id === id ? { 
          ...c, 
          position: newPosition,
          isKing: shouldPromoteToKing({ ...c, position: newPosition }) || c.isKing
        } : c)
        .filter(c => !capturedPos || !(c.position.row === capturedPos.row && c.position.col === capturedPos.col));
      
      const gameWinner = checkWinner(updatedCheckers, nextTurn);
      if (gameWinner) {
        setWinner(gameWinner);
      }
    }, 100);
  };

  const resetGame = () => {
    setCheckers(initialCheckers());
    setCurrentTurn('black');
    setSelectedChecker(null);
    setValidMoves([]);
    setWinner(null);
  };

  return (
    <GameContext value={{
      checkers,
      currentTurn,
      selectedChecker,
      validMoves,
      winner,
      selectChecker,
      moveChecker,
      resetGame
    }}>
      {children}
    </GameContext>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};