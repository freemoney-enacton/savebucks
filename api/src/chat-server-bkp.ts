import { FastifyInstance } from "fastify";
import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";

import * as auth from "./modules/auth/auth.model";
import * as chatModel from "./modules/chat/chat.model";
import * as userModel from "./modules/user/user.model"
import { config } from "./config/config";

export default function setupChatServer(app: FastifyInstance) {
  // 1. Add health check (required for App Platform)
  app.get('/readyz', (_, reply) => reply.send({ status: 'ready' }));

  // 2. Add port validation (recommended safety check)
  const chatPort = parseInt(process.env.CHAT_PORT || '3040', 10);
  if (isNaN(chatPort)) {
    throw new Error('Invalid CHAT_PORT in .env - must be a number');
  }

  // 3. Log startup info (helpful for debugging)
  console.log(`Starting chat server on port ${chatPort}`);

  const io = new SocketIOServer(app.server, {
    cors: {
      origin: "*"
    },
    serveClient: false,
    pingInterval: 10000,  // Send ping every 10 seconds
    pingTimeout: 5000,    // Timeout after 5 seconds if no pong received
    allowUpgrades: true
  });

  const validateToken = (token: string) => {
    const secret = config.env.app.secret;
    if (!secret) return null;

    let decoded: any = null;
    try {
      let decoded = jwt.verify(token, secret);
      if (!decoded) return null;
    } catch (err) {
      console.log(err);
      return null;
    }

    if (!decoded?.exp) return null;

    if (decoded.exp <= Date.now() / 1000) return null;

    return decoded;
  }

  const getUserFromToken = async (token: string) => {
    let userEmail;

    if (token.startsWith("email_")) {
      userEmail = token.split("email_")[1];
    } else {
      const decoded: any = validateToken(token);
      if (!decoded) return null;
      userEmail = decoded.email ? decoded.email : decoded.user.email;
    }

    if (!userEmail) return null;

    const userDetails = await auth.login(userEmail);
    if (!userDetails) return null;

    return userDetails;
  }

  const getRoomDetails = async (room: string) => {
    const roomDetails = await chatModel.getRoom(room);
    return roomDetails;
  }

  const roomCounts: { [key: string]: number } = {};

  io.use(async (socket: any, next: any) => {
    const token = socket.handshake.auth.token;
    const requestRoom = socket.handshake.query.room;
    const requestCountry = socket.handshake.query.country;

    if (!token) {
      return next(new Error("Invalid token"));
    }
    const userDetails = await getUserFromToken(token);
    if (!userDetails) {
      return next(new Error("Invalid token"));
    }
    socket.user = userDetails;

    // const roomDetails = await getRoomDetails(requestRoom);

    // if(!roomDetails) {
    //   return next(new Error("Invalid room"));
    // }

    // if(roomDetails.tier && userDetails.current_tier < roomDetails.tier) {
    //   return next(new Error("Insufficient tier"));
    // }

    // // @ts-ignore
    // if(roomDetails.countries && Array(roomDetails.countries) && !roomDetails.countries.includes(requestCountry)) {
    //   return next(new Error("Invalid country"));
    // }

    // socket.room = roomDetails;

    next();
  })

  const ROOM_COUNT_REFRESH_INTERVAL = 10000;
  const SOCKET_IDLE_TIMEOUT = 60000000;

  setInterval(() => {
    io.emit('room_counts', { roomCounts });
  }, ROOM_COUNT_REFRESH_INTERVAL)

  // io.on("connection", (socket: any) => { /* ... */ });
  io.on("connection", async (socket: any) => {

    let idleTimeout = setTimeout(() => {
      socket.disconnect(true);

      if (roomCounts[socket?.room?.code] && roomCounts[socket?.room?.code] > 0)
        roomCounts[socket?.room?.code] -= 1;

    }, SOCKET_IDLE_TIMEOUT);

    const resetIdleTimeout = () => {
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        socket.disconnect(true);
      }, SOCKET_IDLE_TIMEOUT);
    };

    resetIdleTimeout();

    if (!socket.mentionCount) {
      socket.mentionCount = 0;
    }

    socket.mentionInterval = null;
    socket.notificationInterval = null;

    const mentionsCount = await userModel.fetchMentions(socket.user.id);
    socket.emit("mentions", mentionsCount);

    const unreadNotificationsCount = await userModel.getUnreadNotificationsCount(socket.user.id);
    socket.emit("unread_notifications", unreadNotificationsCount);


    // socket.mentionInterval = setInterval(() => {
    //   socket.emit("fetch_mentions_response", {
    //     count: socket.mentionCount,
    //   });
    // }, 10000); 

    // --- Periodic Unread Notifications Update ---
    socket.notificationInterval = setInterval(async () => {
      try {
        const unreadCount = await userModel.getUnreadNotificationsCount(socket.user.id);
        socket.emit("unread_notifications", unreadCount);
      } catch (err) {
        console.error("Error fetching unread notifications:", err);
      }
    }, 10000);

    socket.on("join_room", async ({ room_code }: any, callback: any) => {

      resetIdleTimeout();

      const requestCountry = socket.handshake.query.country;

      const roomDetails = await getRoomDetails(room_code);

      if (!roomDetails) {
        return callback({ status: 'error', message: "Invalid room" });
      }

      if (roomDetails.tier && socket.user.current_tier < roomDetails.tier) {
        return callback({ status: 'error', message: "Insufficient tier" });
      }

      // @ts-ignore
      if (roomDetails.countries && Array.isArray(roomDetails.countries) && !roomDetails.countries.includes(requestCountry)) {
        return callback({ status: 'error', message: "Invalid country" });
      }

      if (socket.room) {
        socket.leave(socket.room.code);
        roomCounts[socket.room.code] -= 1;
        // io.emit('room_counts', { roomCounts });
      }

      socket.room = roomDetails;
      socket.join(room_code);

      if (roomCounts[room_code]) roomCounts[room_code] += 1;
      else roomCounts[room_code] = 1;
      io.emit('room_counts', { roomCounts });

      const roomMessages = await chatModel.getMessages(room_code, 20);

      const sortedMessages = roomMessages.sort((a, b) => {
        return new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime();
      });
      callback({ status: 'success', user: socket.user, room: roomDetails, messages: sortedMessages });
    });


    // socket.on('message', async (data: any) => {
    //   if(!socket.room) return;

    //   if(!data.message) return;

    //   const message = await chatModel.createMessage(socket.room.code, socket.user.id, data.message);

    //   // @ts-ignore
    //   if(message['mentions']){
    //     message['mentions'] = JSON.parse(message['mentions']);    
    //     for (const mentionedUserId of message['mentions']) {
    //         io.to(socket.room.code).emit("mentions", {
    //           message,
    //           from: socket.user,
    //           room: socket.room,
    //         });
    //     }

    //   } 

    //   io.to(socket.room.code).emit('message', { user: socket.user, message });

    //   resetIdleTimeout();
    // });
    //give chat mentions count


    socket.on('message', async (data: any) => {
      if (!socket.room) return;
      if (!data.message) return;

      const message = await chatModel.createMessage(socket.room.code, socket.user.id, data.message);

      // Parse mentions if they exist
      let mentionedUserIds: (string | number)[] = [];
      if (message['mentions']) {
        try {
          const mentionsObject = JSON.parse(message['mentions']);
          message['mentions'] = JSON.parse(message['mentions']);
          mentionedUserIds = Object.values(mentionsObject).map((user: any) => user.id);
        } catch (e) {
          console.error("Failed to parse mentions:", e);
        }
      }

      // Emit message to everyone in the room
      io.to(socket.room.code).emit('message', { user: socket.user, message });

      console.log("all mentioned users", mentionedUserIds)
      if (mentionedUserIds.length > 0) {
        mentionedUserIds.forEach(async (userId: string | number) => {
          await userModel.incrementMentionCount(Number(userId));

          for (const [id, userSocket] of io.of("/").sockets) {
            //@ts-ignore
            if (userSocket.user?.id == userId) {
              const newCount = await userModel.fetchMentions(Number(userId));
              userSocket.emit("mentions", newCount);
            }
          }


        });

      }

      resetIdleTimeout();
    });



    // Reset mention count
    socket.on("reset_mentions", async () => {
      await userModel.resetMentionsCount(socket.user.id)

      socket.emit("reset_mentions_response", {
        count: 0,
      });
    });

    socket.on("request_unread_notifications", async () => {
      try {
        const unreadCount = await userModel.getUnreadNotificationsCount(socket.user.id);
        socket.emit("unread_notifications", { count: unreadCount });
      } catch (err) {
        console.error("Error fetching unread notifications:", err);
      }
    });

    // On disconnect, remove user from room, emit socket disconnect event


    // Debug: Log connection and disconnection events
    socket.on('disconnect', () => {
      socket.leave(socket?.room?.code);

      if (roomCounts[socket?.room?.code] && roomCounts[socket?.room?.code] > 0)
        roomCounts[socket?.room?.code] -= 1;
    });
  });


  io.engine.on("connection_error", (err: any) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
  });

  app.decorate('io', io);
}