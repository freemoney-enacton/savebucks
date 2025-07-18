function distributePrizes(totalRanks, totalPrizePool, config, minPrize) {
  let prizes = new Array(totalRanks).fill(0);
  let lastPrize = null;

  config.forEach((segment, index) => {
    const startRank = Math.floor(totalRanks * segment.startRankPercent);
    const endRank = Math.floor(totalRanks * segment.endRankPercent);
    const segmentSize = endRank - startRank;
    const poolPrize = totalPrizePool * (segment.poolPrizePercent / 100);

    for (let i = startRank; i < endRank; i++) {
      let currentPrize = poolPrize / segmentSize;

      if (lastPrize !== null) {
        // Adjusting the first prize of this segment to make a smoother transition
        currentPrize = (lastPrize + currentPrize) / 2;
      }

      if (segment.distribution === "logarithmic") {
        currentPrize =
          poolPrize / (Math.log(segmentSize + 1) * Math.log(i - startRank + 2));
      } else if (segment.distribution === "regressive") {
        currentPrize *= 0.95;
      } else if (segment.distribution === "linear") {
        currentPrize = poolPrize / segmentSize;
      }

      // Ensure the prize does not fall below the minimum
      currentPrize = Math.max(currentPrize, minPrize);
      // Ensure no increase in prize from previous rank
      if (lastPrize !== null && currentPrize > lastPrize) {
        currentPrize = lastPrize;
      }
      prizes[i] = currentPrize;
      lastPrize = currentPrize; // Update last prize for the next iteration
    }
  });

  // Normalize prizes to ensure total matches the prize pool
  let totalDistributed = prizes.reduce((acc, prize) => acc + prize, 0);
  if (totalDistributed !== totalPrizePool) {
    const scale = totalPrizePool / totalDistributed;
    prizes = prizes.map((prize) => prize * scale);
    // Update total distributed after scaling
    totalDistributed = prizes.reduce((acc, prize) => acc + prize, 0);
  }

  return prizes.map((prize, index) => ({
    rank: index + 1,
    prize: prize.toFixed(2),
  }));
}

// Configuration example
const config = [
  {
    startRankPercent: 0,
    endRankPercent: 0.1,
    poolPrizePercent: 40, //500 30 percent 5000 40 percent
    distribution: "logarithmic",
  },
  {
    startRankPercent: 0.1,
    endRankPercent: 0.5,
    poolPrizePercent: 30, //500 40 percent 5000 30 percent
    distribution: "regressive",
  },
  {
    startRankPercent: 0.5,
    endRankPercent: 1.0,
    poolPrizePercent: 30, //500 30 percent 5000 20 percent
    distribution: "linear",
  },
];
const totalRanks = 1000;
const totalPrizePool = 900; // Total prize pool in dollars
const minPrize = 0.01;

const distributedPrizes = distributePrizes(
  totalRanks,
  totalPrizePool,
  config,
  minPrize
);

// Output the results
distributedPrizes.forEach((user) => {
  console.log(`Rank ${user.rank}: Prize $${user.prize}`);
});
// Sum up all the distributed prizes
const distributedPrizesSum = distributedPrizes.reduce(
  (acc, user) => acc + parseFloat(user.prize),
  0
);

console.log(totalPrizePool, distributedPrizesSum);
