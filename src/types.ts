export type Position = { 
    row: number; 
    col: number 
};

export type CheckerPiece = {
  id: string;
  position: Position;
  isBlackTeam: boolean;
  isKing: boolean;
};

export type Game = {
  checkers: CheckerPiece[];
  currentTurn: 'black' | 'white';
  selectedChecker: string | null;
  validMoves: Position[];
  winner: 'black' | 'white' | null;
  selectChecker: (id: string) => void;
  moveChecker: (id: string, newPosition: Position) => void;
  resetGame: () => void;
};