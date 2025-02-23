export interface SimulationResult {
  successfulTrades: number;
  failedTrades: number;
  winRate: number;
  longestWinStreak: number;
  longestLossStreak: number;
  finalBalance: number;
  profitLoss: number;
  averageWin: number;
  averageLoss: number;
  maxDrawdown: number;
  balanceHistory: number[];
  tradesPerDay: number[];
  winsPerDay: number[];
  lossesPerDay: number[];
  totalCashOut: number;
  cashOutHistory: { day: number; amount: number }[];
  currentDay: number;
}

export function* simulationGenerator(
  initialBalance: number,
  riskReward: number,
  maxTradesPerDay: number,
  riskPercentage: number,
  days: number = 365
): Generator<SimulationResult> {
  let balance = initialBalance;
  let successfulTrades = 0;
  let failedTrades = 0;
  let currentWinStreak = 0;
  let currentLossStreak = 0;
  let longestWinStreak = 0;
  let longestLossStreak = 0;
  let totalWins = 0;
  let totalLosses = 0;
  let balanceHistory = [initialBalance];
  let tradesPerDay = [0];
  let winsPerDay = [0];
  let lossesPerDay = [0];
  let maxBalance = initialBalance;
  let maxDrawdown = 0;
  let totalCashOut = 0;
  let cashOutHistory: { day: number; amount: number }[] = [];

  for (let day = 1; day <= days; day++) {
    // Random number of trades for the day (0 to maxTradesPerDay)
    const trades = Math.floor(Math.random() * (maxTradesPerDay + 1));
    let dailyWins = 0;
    let dailyLosses = 0;
    
    for (let trade = 0; trade < trades; trade++) {
      const riskAmount = balance * (riskPercentage / 100);
      const rewardAmount = riskAmount * riskReward;
      
      const isWin = Math.random() < 0.45; // 45% win rate
      
      if (isWin) {
        balance += rewardAmount;
        successfulTrades++;
        dailyWins++;
        currentWinStreak++;
        currentLossStreak = 0;
        totalWins += rewardAmount;
        
        if (currentWinStreak > longestWinStreak) {
          longestWinStreak = currentWinStreak;
        }
      } else {
        balance -= riskAmount;
        failedTrades++;
        dailyLosses++;
        currentLossStreak++;
        currentWinStreak = 0;
        totalLosses += riskAmount;
        
        if (currentLossStreak > longestLossStreak) {
          longestLossStreak = currentLossStreak;
        }
      }
      
      if (balance > maxBalance) {
        maxBalance = balance;
      }
      
      const currentDrawdown = (maxBalance - balance) / maxBalance;
      if (currentDrawdown > maxDrawdown) {
        maxDrawdown = currentDrawdown;
      }
    }

    // Cash out 50% of profits every 30 days
    if (day % 30 === 0 && balance > initialBalance) {
      const profits = balance - initialBalance;
      const cashOutAmount = profits * 0.5;
      balance -= cashOutAmount;
      totalCashOut += cashOutAmount;
      cashOutHistory.push({ day, amount: cashOutAmount });
    }

    balanceHistory.push(balance);
    tradesPerDay.push(trades);
    winsPerDay.push(dailyWins);
    lossesPerDay.push(dailyLosses);

    const totalTrades = successfulTrades + failedTrades;
    const winRate = totalTrades > 0 ? successfulTrades / totalTrades : 0;
    const averageWin = successfulTrades > 0 ? totalWins / successfulTrades : 0;
    const averageLoss = failedTrades > 0 ? totalLosses / failedTrades : 0;

    yield {
      successfulTrades,
      failedTrades,
      winRate,
      longestWinStreak,
      longestLossStreak,
      finalBalance: balance,
      profitLoss: balance - initialBalance + totalCashOut,
      averageWin,
      averageLoss,
      maxDrawdown,
      balanceHistory,
      tradesPerDay,
      winsPerDay,
      lossesPerDay,
      totalCashOut,
      cashOutHistory,
      currentDay: day
    };
  }
}