type VictoryModalProps = {
  winner: 'black' | 'white';
  onNewGame: () => void;
};

export function VictoryModal({ winner, onNewGame }: VictoryModalProps) {
  const winnerText = winner === 'black' ? '⚫ Negras' : '⚪ Blancas';
  const winnerColor = winner === 'black' ? 'bg-gray-800' : 'bg-gray-100';
  const winnerTextColor = winner === 'black' ? 'text-white' : 'text-gray-900';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn"
      onClick={onNewGame}
    >
      <div 
        className={`${winnerColor} ${winnerTextColor} rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform animate-scaleIn`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-8xl mb-4 animate-bounce">
            🏆
          </div>
          
          <h2 className="text-4xl font-bold mb-2">
            ¡Victoria!
          </h2>
          
          <p className="text-2xl mb-6">
            Ganador: <span className="font-bold">{winnerText}</span>
          </p>
          
          <div className="text-4xl mb-6 space-x-2">
            <span className="inline-block animate-bounce" style={{ animationDelay: '0s' }}>🎉</span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.1s' }}>🎊</span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
          </div>
          
          <button
            onClick={onNewGame}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            🔄 Nueva Partida
          </button>
        </div>
      </div>
    </div>
  );
}
