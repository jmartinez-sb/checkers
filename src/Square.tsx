export function Square(props: { boardSize: number, isDark: boolean }) {
    const size = props.boardSize / 8;
  return (
    <>
      <div
        className={
          `square 
          border-black 
          border-solid 
          border-2 
          ${props.isDark ? 'bg-amber-800' : 'bg-white'}
          {/* size-${size} */}
          `} style={{ width: size, height: size }}
      ></div>
    </>
  );
}