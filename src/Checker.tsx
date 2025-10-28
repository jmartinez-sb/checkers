export function Checker(props: { boardSize: number, isBlackTeam: boolean, isKing: boolean }) {
    const size = (props.boardSize / 8) * 80 / 100;
  return (
    <>
      <div
        className={
          `checker 
          border-black 
          border-solid 
          border-2 
          rounded-full
          ${props.isBlackTeam ? 'bg-black' : 'bg-white'}
          ${props.isKing ? 'border-4 border-yellow-500' : ''}
          {/* size-${size} */}
          `} style={{ width: size, height: size }}
      ></div>
    </>
  );
}