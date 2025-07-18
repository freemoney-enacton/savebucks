module.exports = {
  apps: [
    {
      name: "Savebucks-api",
      script: "npm",
      args: "start",
    },
    {
      name: "Savebucks-chat",
      script: "npm",
      args: "run start:chat",
      node_args: '--max-old-space-size=512', // 512MB limit
      max_memory_restart: '400M'
    },
    {
      name: "Savebucks-cron",
      script: "npm",
      args: "run start:cron",
    }
  ]
};
