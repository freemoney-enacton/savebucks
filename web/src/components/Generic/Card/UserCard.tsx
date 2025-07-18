import React from 'react';
import TableTitle from '../Table/TableTitle';

export default function UserCard({ children, customClass }: any) {
  return <div className={`bg-black-250 p-5 sm:p-7 rounded-lg ${customClass ? customClass : ''}`}>{children}</div>;
}
const UserCardHead = ({ children, customClass, title }: any) => {
  return (
    <div className={`flex items-center justify-between gap-2 ${customClass ? customClass : ''}`}>
      {title && <TableTitle title={title} />}
      {children}
    </div>
  );
};
const UserCardBody = ({ children, customClass }: any) => {
  return <div className={`${customClass ? customClass : ''}`}>{children}</div>;
};

UserCard.Head = UserCardHead;
UserCard.Body = UserCardBody;
