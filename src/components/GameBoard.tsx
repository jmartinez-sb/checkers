import { Board } from '../Board';
import { Checker } from '../Checker';
import { useGame } from '../Game';
import { VictoryModal } from './VictoryModal';

export function GameBoard() {
  const { 
    checkers, 
    currentTurn, 
    selectedChecker,
    validMoves,
    winner,
    selectChecker, 
    moveChecker,
    resetGame 
  } = useGame();
  const boardSize = 600;
  const squareSize = boardSize / 8;

  const handleSquareClick = (row: number, col: number) => {
    if (!selectedChecker) return;
    
    const isValidMove = validMoves.some(
      move => move.row === row && move.col === col
    );
    
    if (isValidMove) {
      moveChecker(selectedChecker, { row, col });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-5">
      <h2 className="text-2xl font-bold">
        Turno: {currentTurn === 'black' ? '⚫ Negras' : '⚪ Blancas'}
      </h2>
      <button 
        onClick={resetGame}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        🔄 Reiniciar Juego
      </button>
      
      <div className="relative inline-block">
        <Board boardSize={boardSize} />
        
        {validMoves.map((move, index) => (
          <div
            key={`valid-move-${index}`}
            style={{
              position: 'absolute',
              left: move.col * squareSize,
              top: move.row * squareSize,
              width: squareSize,
              height: squareSize,
              backgroundColor: 'rgba(0, 255, 0, 0.3)',
              border: '3px solid lime',
              cursor: 'pointer',
              pointerEvents: 'all'
            }}
            onClick={() => handleSquareClick(move.row, move.col)}
          />
        ))}
        
        {checkers.map(checker => {
          const isSelected = selectedChecker === checker.id;
          
          return (
            <div
              key={checker.id}
              style={{
                position: 'absolute',
                left: checker.position.col * squareSize,
                top: checker.position.row * squareSize,
                transition: 'all 0.3s ease',
                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                filter: isSelected ? 'drop-shadow(0 0 10px yellow)' : 'none'
              }}
              className="cursor-pointer hover:scale-110"
              onClick={() => selectChecker(checker.id)}
            >
              <Checker 
                boardSize={boardSize} 
                isBlackTeam={checker.isBlackTeam} 
                isKing={checker.isKing} 
              />
            </div>
          );
        })}
      </div>
      
      {winner && (
        <VictoryModal winner={winner} onNewGame={resetGame} />
      )}
    </div>
  );
}
