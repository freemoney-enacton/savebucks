module.exports = {
  apps: [
    {
      name: "Savebucks-Affiliates-Crons",
      script: "node",
      args: "-r esbuild-register crons.ts",
    },
  ],
};
