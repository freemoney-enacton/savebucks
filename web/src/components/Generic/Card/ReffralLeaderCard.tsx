import Image from 'next/image';

const ReffralLeaderCard = ({ rank, name, amount, user_image }: { rank: any; name: any; amount: any; user_image?: any }) => {
  return (
    <div className={`w-full ${rank == 1 ? 'max-w-[230px] lg:max-w-[400px] mb-10' : 'max-w-[180px] lg:max-w-[300px]'} space-y-2`}>
      {rank == 1 && (
        <div className="h-8 sm:h-14 lg:h-[71px] text-center">
          <Image
            src="/images/rank-1-crown.png"
            alt="crown"
            className="size-8 sm:size-14 lg:size-[71px] mx-auto"
            width={300}
            height={300}
          />
        </div>
      )}
      <div
        className={`relative size-20 sm:size-[120px] lg:size-[162px] rounded-full mx-auto border-2 sm:border-4 ${
          rank == 1 ? 'border-rank-1' : rank == 2 ? 'border-rank-2' : 'border-rank-3'
        }`}
      >
        {/* TODO: replace with dynamic image */}
        {user_image ? (
          <div className="size-20 sm:size-[120px] lg:size-[162px] rounded-full overflow-hidden">
            <Image
              src={user_image}
              alt={`${name}'s profile`}
              className="h-full w-full object-cover rounded-full"
              width={300}
              height={300}
            />
          </div>
        ) : (
          <div className="w-full h-full grid place-content-center bg-blue-700 rounded-full px-3 text-center">
            <span className={`text-black text-xl sm:text-3xl font-semibold`}>{name?.charAt(0)?.toUpperCase()}</span>
          </div>
        )}
        <div
          className={`absolute -bottom-2 sm:-bottom-3 lg:-bottom-4 right-1/2 transform translate-x-1/2 size-5 sm:size-7 lg:size-10 grid place-content-center rounded-full ${
            rank == 1 ? 'bg-rank-1' : rank == 2 ? 'bg-rank-2' : 'bg-rank-3'
          } z-[0]`}
        >
          <p className="text-white text-xs sm:text-base lg:text-xl font-semibold">{rank}</p>
        </div>
      </div>
      <div className="space-y-1 text-center">
        <p className="text-white mt-4 text-sm sm:text-lg lg:text-2xl font-semibold">{name}</p>
        <div className="flex items-center justify-center gap-1.5 sm:gap-3">
          <Image src={'/svg/crown.svg'} className="size-4 sm:size-6" alt="badge" width={30} height={30} />
          <p className="bg-primary-gr text-transparent bg-clip-text sm:text-lg lg:text-2xl font-medium">{amount}</p>
        </div>
        <Image
          src="/images/platform.png"
          className="relative !-mt-1.5 sm:!-mt-3 lg:!-mt-6 w-full h-auto z-0"
          alt="platform"
          width={500}
          height={300}
        />
      </div>
    </div>
  );
};

export default ReffralLeaderCard;
