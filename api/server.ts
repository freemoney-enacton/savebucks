import app from "./src/app";
import { config } from "./src/config/config";
import setupChatServer from "./src/chat-server-bkp";
import cron from "node-cron";
import { cronConfig } from "./src/crons/cronConfig";

const startServer = async () => {
  try {
    console.log("🚀 Starting server initialization...");

    // Wait for the app instance to be ready
    console.log("⏳ Waiting for app instance...");
    const appInstance = await app;

    // console.log("💬 Setting up chat server...");
    // setupChatServer(appInstance);
    // console.log("✅ Chat server setup complete");

    

    console.log("🔄 Waiting for app to be ready...");

    // Add timeout for the ready event
    const readyTimeout = setTimeout(() => {
      console.error("💥 App ready timeout - something is preventing the app from becoming ready");
      console.error("🔍 Check your plugins, database connections, and Redis configuration");
      process.exit(1);
    }, 60000); // 60 second timeout

    appInstance.ready((err) => {
      clearTimeout(readyTimeout);

      console.log("📋 App ready callback triggered");
      if (err) {
        console.error("💥 Error in app.ready:", err);
        throw err;
      }

      const port = Number(config.env.app.port) || 3000;
      const host = config.env.app.host || '0.0.0.0';

      console.log("🌐 Server configuration:", {
        port,
        host,
        environment: process.env.NODE_ENV || 'development'
      });

      console.log("🚀 Starting server listen...");
      appInstance.listen(
        { port, host },
        (err: Error | null, address: string) => {
          if (err) {
            console.error("💥 Server listen error:", err);
            appInstance.log.error(err);
            process.exit(1);
          }
          console.log(`🎉 Server successfully running on ${address}`);
          console.log(`📚 API Documentation: ${address}/documentation`);
          console.log(`❤️ Health Check: ${address}/health`);
          appInstance.log.info(`Server running on ${address}`);
        }
      );
    });

  } catch (error) {
    console.error("💥 Fatal error during server startup:", error);
    process.exit(1);
  }
};

// Add global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();