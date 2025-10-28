import { Square } from './Square.tsx'

export function Board({ boardSize }: { boardSize: number }) {
  return (
    <>
      <div className="board-row grid grid-cols-8 grid-rows-8">
        {Array.from({ length: 64 }, (_, index) => (
          <Square key={index} boardSize={boardSize} isDark={(Math.floor(index / 8) + index) % 2 === 1} />
        ))}
      </div>
    </>
  );
}
