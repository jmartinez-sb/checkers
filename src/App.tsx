import './App.css'
import { BlackTeam } from './BlackTeam.tsx';
import { Board } from './Board.tsx'
import { Checker } from './Checker.tsx';
import { WhiteTeam } from './WhiteTeam.tsx';

function App() {

  const boardSize = 600;
  return (
    <>
      <Board boardSize={boardSize} />
      <Checker boardSize={boardSize} isBlackTeam={true} isKing={true} />
      <Checker boardSize={boardSize} isBlackTeam={false} isKing={true} />
      <WhiteTeam boardSize={boardSize} />
      <BlackTeam boardSize={boardSize} />
    </>
  )
}

export default App
