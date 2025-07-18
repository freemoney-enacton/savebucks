export default function FullWidthWrapper({ children, customClass }: any) {
  return <div className={`py-5 sm:py-10 px-4 sm:px-16 ${customClass ? customClass : ''}`}>{children}</div>;
}
