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
  currentDay: number;
}

export interface SimulationState extends SimulationResult {
  isRunning: boolean;
  speed: number;
}

export function* simulationGenerator(
  initialBalance: number,
  riskReward: number,
  maxTradesPerDay: number,
  days: number = 365 // Changed to 1 year
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
  let maxBalance = initialBalance;
  let maxDrawdown = 0;

  for (let day = 0; day < days; day++) {
    const trades = Math.floor(Math.random() * (maxTradesPerDay + 1));
    
    for (let trade = 0; trade < trades; trade++) {
      const riskAmount = balance * 0.02;
      const rewardAmount = riskAmount * riskReward;
      
      const isWin = Math.random() < 0.45;
      
      if (isWin) {
        balance += rewardAmount;
        successfulTrades++;
        currentWinStreak++;
        currentLossStreak = 0;
        totalWins += rewardAmount;
        
        if (currentWinStreak > longestWinStreak) {
          longestWinStreak = currentWinStreak;
        }
      } else {
        balance -= riskAmount;
        failedTrades++;
        currentLossStreak++;
        currentWinStreak = 0;
        totalLosses += riskAmount;
        
        if (currentLossStreak > longestLossStreak) {
          longestLossStreak = currentLossStreak;
        }
      }
      
      balanceHistory.push(balance);
      
      if (balance > maxBalance) {
        maxBalance = balance;
      }
      
      const currentDrawdown = (maxBalance - balance) / maxBalance;
      if (currentDrawdown > maxDrawdown) {
        maxDrawdown = currentDrawdown;
      }
    }

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
      profitLoss: balance - initialBalance,
      averageWin,
      averageLoss,
      maxDrawdown,
      balanceHistory,
      currentDay: day + 1
    };
  }
}