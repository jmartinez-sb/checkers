import { Checker } from "./Checker";

export function WhiteTeam(props: { boardSize: number }) {
    const whiteTeam = Array.from({ length: 12 }, (_, index) => (
      <Checker
        key={index}
        boardSize={props.boardSize}
        isBlackTeam={false}
        isKing={false}
      />
    ));
  return (
    <>
        {whiteTeam}
    </>
  );
}