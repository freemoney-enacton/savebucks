const app = require("express")();
import * as OneSignal from "onesignal-node";
const httpServer = require("http").createServer(app);
import jwt from "jsonwebtoken";

import * as auth from "../src/modules/auth/auth.model";
import * as chatModel from "../src/modules/chat/chat.model";
import * as userModel from "../src/modules/user/user.model"
import { config } from "./config/config";
import { not } from "tap/dist/commonjs/main";

const oneSignalClient = new OneSignal.Client(
  config.env.app.onesignal_Id,
  config.env.app.onesignal_key
);
const frontendUrl = config.env.app.frontend_url;

const io = require("socket.io")(httpServer, {
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
  if(!secret) return null;

  let decoded: any = null;
  try {
    decoded = jwt.verify(token, secret);
    if(!decoded) return null;
  } catch (err) {
    console.log(err);
    return null;
  }

  if(!decoded?.exp) return null;

  if(decoded.exp <= Date.now() / 1000) return null;

  return decoded;
}

const getUserFromToken = async (token: string) => {
  let userEmail;
  
  if(token.startsWith("email_")) {
    userEmail = token.split("email_")[1];
  } else {
    const decoded: any = validateToken(token);
    if(!decoded) return null;
    userEmail = decoded.email ? decoded.email : decoded.user.email;
  }

  if(!userEmail) return null;

  const userDetails = await auth.login(userEmail);
  if(!userDetails) return null;

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
  if(!userDetails) {
    return next(new Error("Invalid token"));
  }
  socket.user = userDetails;

  next();
})

const ROOM_COUNT_REFRESH_INTERVAL = 10000;
const SOCKET_IDLE_TIMEOUT = 60000000;

setInterval(() => {
  io.emit('room_counts', { roomCounts });
}, ROOM_COUNT_REFRESH_INTERVAL)

const userSockets = new Map();
// io.on("connection", (socket: any) => { /* ... */ });
io.on("connection", async (socket: any) => {

  const userId = socket.user.id;
  if (!userSockets.has(userId)) {
    userSockets.set(userId, new Set());
  }
  userSockets.get(userId).add(socket.id);
  
  const socketCount = userSockets.get(userId).size;
  console.log(`🔌 User ${userId} connected. Total sockets: ${socketCount}`);

  let idleTimeout: NodeJS.Timeout | null = null;

  const clearIdleTimeout = () => {
    if (idleTimeout) {
      clearTimeout(idleTimeout);
      idleTimeout = null;
    }
  };

  const scheduleIdleTimeout = () => {
    clearIdleTimeout();
    idleTimeout = setTimeout(() => {
      socket.disconnect(true);

      if(roomCounts[socket?.room?.code] && roomCounts[socket?.room?.code] > 0)
        roomCounts[socket?.room?.code] -= 1;

    }, SOCKET_IDLE_TIMEOUT);
  };

  const resetIdleTimeout = () => {
    scheduleIdleTimeout();
  };

  scheduleIdleTimeout();
  if (!socket.mentionCount) {
        socket.mentionCount = 0;
      }
  
      socket.mentionInterval = null;
      socket.notificationInterval = null;
  
      const mentionsCount = await userModel.fetchMentions(socket.user.id);
      socket.emit("mentions", mentionsCount);
  
      const unreadNotificationsCount = await userModel.getUnreadNotificationsCount(socket.user.id);
      socket.emit("unread_notifications", unreadNotificationsCount);
  
  
      // --- Periodic Unread Notifications Update ---
      if (socket.notificationInterval) {
        clearInterval(socket.notificationInterval);
        socket.notificationInterval = null;
      }

      socket.notificationInterval = setInterval(async () => {
        try {
          const unreadCount = await userModel.getUnreadNotificationsCount(socket.user.id);
          socket.emit("unread_notifications", unreadCount);
        } catch (err) {
          console.error("Error fetching unread notifications:", err);
        }
      }, 10000);

   if (socketCount === 1 && socket.user.onesignal_notification_id) {
    try {
      const response = await oneSignalClient.cancelNotification(socket.user.onesignal_notification_id);
      console.log("Notification cancelled successfully:", socket.user.id);
      await userModel.clearOneSignalNotificationId(socket.user.id);
    } catch (error) {
      console.error("Failed to cancel notification:", error);
      await userModel.clearOneSignalNotificationId(socket.user.id);
    }
  }

  socket.on("join_room", async ({room_code}: any, callback: any) => {

    resetIdleTimeout();

    const requestCountry = socket.handshake.query.country;
    
    const roomDetails = await getRoomDetails(room_code);

    if(!roomDetails) {
      return callback({status: 'error', message: "Invalid room"});
    }
  
    if(roomDetails.tier && socket.user.current_tier < roomDetails.tier) {
      return callback({status: 'error', message: "Insufficient tier"});
    }
  
    // @ts-ignore
    if(roomDetails.countries && Array.isArray(roomDetails.countries) && !roomDetails.countries.includes(requestCountry)) {
      return callback({status: 'error', message: "Invalid country"});
    }
    
    if(socket.room) {
      socket.leave(socket.room.code);
      roomCounts[socket.room.code] -= 1;
      // io.emit('room_counts', { roomCounts });
    }

    socket.room = roomDetails;
    socket.join(room_code);

    if(roomCounts[room_code]) roomCounts[room_code] += 1;
    else roomCounts[room_code] = 1;
    io.emit('room_counts', { roomCounts });

    const roomMessages = await chatModel.getMessages(room_code, 20);

    const sortedMessages = roomMessages.sort((a, b) => {
      return new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime();
    });
    callback({status:'success', user: socket.user, room: roomDetails, messages: sortedMessages});
  });

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
  
        //console.log("all mentioned users", mentionedUserIds)
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

  socket.on("fetch_messages", async ( {page, limit}:any,callback:any) => {
  try {

    if (!socket.room) return;
    const roomMessages = await chatModel.getPaginatedMessages(socket.room.code, limit, page);

    const sortedMessages = roomMessages.data.sort((a, b) => {
      return new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime();
    });


    callback({
      status: 'success',
      messages: sortedMessages,
      currentPage: page,
      lastPage: roomMessages.lastPage
    });
  } catch (error) {
    callback({ status: 'error', message: 'Failed to fetch messages' });
  }
});

  // Debug: Log connection and disconnection events
  socket.on('disconnect', async () => {
    clearIdleTimeout();

    if (socket.notificationInterval) {
      clearInterval(socket.notificationInterval);
      socket.notificationInterval = null;
    }

    const userSocketSet = userSockets.get(userId);
    userSocketSet?.delete(socket.id);

    if (userSocketSet && userSocketSet.size === 0) {
      userSockets.delete(userId);
    }

    const remainingSockets = userSockets.get(userId)?.size ?? 0;
    console.log(`🔌 User ${userId} disconnected. Remaining sockets: ${remainingSockets}`);
    
    // Room cleanup (your existing code)
    socket.leave(socket?.room?.code);
    if (roomCounts[socket?.room?.code] && roomCounts[socket?.room?.code] > 0)
      roomCounts[socket?.room?.code] -= 1;

    
    socket.leave(socket?.room?.code);

    if(roomCounts[socket?.room?.code] && roomCounts[socket?.room?.code] > 0)
      roomCounts[socket?.room?.code] -= 1;

    //onesignal ntofication
  try {
    let result=await chatModel.getNotificationContents('inactive_user');
    if(!result?.title){
      console.error("No content found for the notification");
      return 
    }
  if(socket.user.lang !=null || socket.user.lang != undefined){
    //@ts-ignore
    result.title['en']=result.title[socket.user.lang] 
  }
  
    const notificationPayload = {
    include_external_user_ids: [`${socket.user.email ?? socket.user.id}`],
    contents: result.title as any,
    url:`${frontendUrl}${result.route}`,
    channel_for_external_user_ids: "push",
    send_after: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
  };
    const notification=await oneSignalClient.createNotification(notificationPayload);
    if(socket.user.id == 33488 || socket.user.id == 29503){
      console.log("Notification scheduled successfully:",socket.user.id);
    }
    await userModel.saveNotification(socket.user.id, notification.body.id);
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
  });

  
  
});


io.engine.on("connection_error", (err: any) => {
  console.log(err.req);      // the request object
  console.log(err.code);     // the error code, for example 1
  console.log(err.message);  // the error message, for example "Session ID unknown"
  console.log(err.context);  // some additional error context
});

httpServer.listen(config.env.app.chat_port);
// WARNING !!! app.listen(3000); will not work here, as it creates a new HTTP server