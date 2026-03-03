import { Checker } from "./Checker";

export function Team({ boardSize, isBlackTeam }: { boardSize: number, isBlackTeam: boolean }) {
    const team = Array.from({ length: 12 }, (_, index) => (
      <Checker
        key={index}
        boardSize={boardSize}
        isBlackTeam={isBlackTeam}
        isKing={false}
      />
    ));
  return (
    <>
        {team}
    </>
  );
}