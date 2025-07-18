export default function GradientButtonWithImg({
  iconComponent,
  textKey,
  width,
  onClick,
}: {
  iconComponent: any;
  textKey: string;
  width?: string;
  onClick?: () => void;
}) {
  return (
    <>
      {/* <MTWrapper
      component={Button}
      variant="gradient"
      color="white"
      onClick={onClick}
      className={`flex mr-1 gap-[6px] p-2 rounded-2xl justify-center bg-gradient-to-r from-pinkPurpleBlueGradient-0 via-pinkPurpleBlueGradient-1 to-pinkPurpleBlueGradient-2 text-themeWhite font-bold  focus:ring-blue-500 focus:ring-opacity-50 ${width}`}
      fullWidth
    >
      {iconComponent}
      <p className="normal-case text-[14px]"> {translate(textKey)}</p>
    </MTWrapper> */}
    </>
  );
}
