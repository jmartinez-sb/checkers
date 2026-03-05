import './App.css'
import { GameProvider } from './Game';
import { GameBoard } from './components/GameBoard';

function App() {
  return (
    <GameProvider>
      <GameBoard />
    </GameProvider>
  );
}

export default App
