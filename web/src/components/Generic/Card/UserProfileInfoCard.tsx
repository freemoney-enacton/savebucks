import React from 'react';

const UserProfileInfoCard = ({
  value,
  label,
  icon,
  cardbg,
  iconbg,
}: {
  value?: any;
  label?: any;
  icon?: any;
  cardbg?: any;
  iconbg?: any;
}) => {
  return (
    <div
      className={`user-stats-mini-card flex-shrink-0 flex-1 min-w-[120px] px-1.5 py-2.5 space-y-1 ${
        cardbg ? cardbg : 'bg-blue-200'
      } rounded-xl text-white text-center`}
    >
      <p className="min-h-4 sm:min-h-5 text-xs sm:text-sm font-semibold">{value}</p>
      <p className="text-xxs font-medium break-all line-clamp-1">{label}</p>
    </div>
  );
};

export default UserProfileInfoCard;
