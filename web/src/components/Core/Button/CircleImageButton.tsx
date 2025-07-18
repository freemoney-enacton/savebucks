import React from 'react';

export default function ImageButton({ onTap, img, style }: { onTap?: () => void; img: string; style?: string }) {
  return (
    <>
      {/* <MTWrapper
        component={Button}
        size="md"
        variant="outlined"
        color="blue-gray"
        className={`items-center rounded-full p-[5px] bg-themeWhite ${style}`}
      >
        <img src={img} alt="metamask" className=" h-8 w-8 p-0 m-0 " />
      </MTWrapper> */}
    </>
  );
}
