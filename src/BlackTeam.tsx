import { Checker } from "./Checker";

export function BlackTeam({ boardSize }: { boardSize: number }) {
    const blackTeam = Array.from({ length: 12 }, (_, index) => (
      <Checker
        key={index}
        boardSize={boardSize}
        isBlackTeam={true}
        isKing={false}
      />
    ));
  return (
    <>
        {blackTeam}
    </>
  );
}