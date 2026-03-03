import './App.css'
import { Team } from './Team.tsx';
import { Board } from './Board.tsx'
import { Checker } from './Checker.tsx';

function App() {

  const boardSize = 600;
  return (
    <>
      <Board boardSize={boardSize} />
      <Checker boardSize={boardSize} isBlackTeam={true} isKing={true} />
      <Checker boardSize={boardSize} isBlackTeam={false} isKing={true} />
      <Team boardSize={boardSize} isBlackTeam={true} />
      <Team boardSize={boardSize} isBlackTeam={false} />
    </>
  )
}

export default App
