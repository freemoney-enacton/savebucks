import MessageComponent from '@/components/Generic/Chat/MessageComponent';
import { config } from '@/config';
import { arrayAtomFamily, booleanDefaultFalseAtomFamily, numberAtomFamily, objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { io, Socket } from 'socket.io-client';
import { public_get_api } from './Api/Server/use-server';
import { Toast } from '@/components/Core/Toast';

const useChat = () => {
  const { data: session }: any = useSession();
  const token = session?.user?.token;
  const email = session?.user?.user?.email;
  const [messages, setMessages] = useState<any>([]);
  const messagesEndRef = useRef<any>(null);
  const [socket, setSocket] = useState<Socket<any, any>>();
  const [chatRooms, setChatRooms] = useRecoilState<any>(arrayAtomFamily(atomKey.chatRooms));
  const [selectedRoom, setSelectedRoom] = useState('general');
  const [isValidSelectedRoom, setIsValidSelectedRoom] = useState(selectedRoom);
  const [isConnected, setIsConnected] = useRecoilState(booleanDefaultFalseAtomFamily(atomKey.isConnected));
  const [loading, setLoading] = useState(true);
  const [reconnectSocket, setReconnectSocket] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isPaginating, setIsPaginating] = useState(false);
  const setMentionCounter = useSetRecoilState(numberAtomFamily(atomKey.chatMentionCounter));
  const setNotificationCounter = useSetRecoilState(numberAtomFamily(atomKey.notificationMentionCounter));
  const [roomCounts, setRoomCounts] = useRecoilState<{
    general?: number;
    holidays?: number;
  }>(objectAtomFamily(atomKey.roomCounts));

  useEffect(() => {
    getChatRooms();
    return () => {};
  }, []);

  useEffect(() => {
    if (token && !socket) {
      connect();
    }
    return () => {};
  }, [token]);

  useEffect(() => {
    if (socket) {
      socket.on('message', (data) => {
        setMessages((prevMessages) => {
          return [...prevMessages, { ...data.message, MessageComponent: <MessageComponent message={data.message} /> }];
        });
        scrollToBottom({ checkIsBottomOfScreen: true });
      });
      socket.on('connect_error', (err) => {
        setReconnectSocket(true);
      });
      socket.on('connect', () => {
        joinRoom(isValidSelectedRoom, socket);
      });
      socket.on('room_counts', (data) => {
        setRoomCounts(data.roomCounts);
      });
      socket.on('mentions', (data) => {
        setMentionCounter(data?.count);
      });
      socket.on('unread_notifications', (data) => {
        setNotificationCounter(data?.count);
      });
    }
    return () => {};
  }, [isConnected, socket]);

  const fetchMessages = (page = 1) => {
    setIsPaginating(true);
    const container = messagesEndRef.current;
    let prevScrollHeight = container ? container.scrollHeight : 0;
    let prevScrollTop = container ? container.scrollTop : 0;

    socket?.emit('fetch_messages', { page, limit: 20, room_code: isValidSelectedRoom }, (response) => {
      if (response.status === 'success') {
        setCurrentPage(response.currentPage);
        setLastPage(response.lastPage);
        setMessages((prev) =>
          page === 1
            ? response.messages.map((item) => ({
                ...item,
                MessageComponent: <MessageComponent message={item} />,
              }))
            : [
                ...response.messages.map((item) => ({
                  ...item,
                  MessageComponent: <MessageComponent message={item} />,
                })),
                ...prev,
              ]
        );
        if (page === 1) {
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        } else {
          requestAnimationFrame(() => {
            if (container) {
              const newScrollHeight = container.scrollHeight;
              container.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
            }
          });
        }
      }
      setIsPaginating(false);
    });
  };

  const joinRoom = (room, socketConnection) => {
    socketConnection?.emit('join_room', { room_code: room }, (response) => {
      if (response.status !== 'success') {
        Toast.errorBottomRight(response.message);
        setSelectedRoom(isValidSelectedRoom);
        return;
      }
      setIsValidSelectedRoom(room);
      fetchMessages(1); // fetch first page
    });
  };

  const handleScroll = (e) => {
    if (e.target.scrollTop === 0 && currentPage < lastPage && !isPaginating) {
      fetchMessages(currentPage + 1);
    }
  };

  const handleSendMessage = (e, setChatText, setTextInput) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get('chatInput') as string;
    if (text?.trim()) {
      socket?.emit('message', { message: text.trim() });
      scrollToBottom();
      setTimeout(() => {
        // @ts-ignore
        setChatText('');
        setTextInput?.('');
      }, 100);
    }
  };

  const scrollToBottom = ({ checkIsBottomOfScreen = false } = {}) => {
    const margin = 50;
    const isBottomOfScreen =
      messagesEndRef.current?.scrollHeight - messagesEndRef.current?.scrollTop <= messagesEndRef.current?.clientHeight + margin;
    if (checkIsBottomOfScreen) {
      if (isBottomOfScreen) {
        scrollWithSmoothBehavior();
      }
    } else {
      scrollWithSmoothBehavior();
    }
  };

  const scrollWithSmoothBehavior = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollTo({
        top: Number.MAX_SAFE_INTEGER,
        behavior: 'smooth',
      });
    }, 500);
  };

  useEffect(() => {
    if (socket) {
      joinRoom(selectedRoom, socket);
    }
    return () => {};
  }, [selectedRoom, socket]);

  useEffect(() => {
    if (reconnectSocket) {
      setReconnectSocket(false);
      socket?.disconnect();
      setTimeout(() => {
        connect();
      }, 1000);
    }
  }, [reconnectSocket]);

  async function getChatRooms() {
    if (chatRooms.length > 0) return;
    const roomList = await public_get_api({
      path: 'chat/rooms',
    });
    setIsValidSelectedRoom(roomList?.data?.find((el) => el.default)?.code);

    setChatRooms(roomList?.data || []);
  }

  function connect() {
    const socketConnection = io(config.WS_URL ?? '', {
      auth: {
        token: 'email_' + email,
        //   token,
      },
      query: { country: 'IN' },
    });
    setSocket(socketConnection);
    setIsConnected(true);
    setLoading(false);
  }

  function resetMentionCounter() {
    socket?.emit('reset_mentions', { room_code: isValidSelectedRoom });
    setMentionCounter(0);
  }

  return {
    handleSendMessage,
    joinRoom,
    setSelectedRoom,
    messages,
    messagesEndRef,
    chatRooms,
    selectedRoom,
    isConnected,
    loading,
    roomCounts,
    isValidSelectedRoom,
    setIsValidSelectedRoom,
    resetMentionCounter,
    handleScroll,
    isPaginating,
  };
};

export default useChat;
