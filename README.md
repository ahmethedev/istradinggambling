# Trading Simulation App

A React-based trading simulation application that allows users to visualize and analyze different trading strategies using customizable parameters. The application simulates trading scenarios over a year period with configurable risk management settings.

## Features

- Real-time trading simulation over 365 days
- Customizable trading parameters:
  - Initial balance
  - Risk percentage per trade
  - Risk-to-reward ratio
  - Maximum trades per day
- Interactive controls:
  - Play/Pause simulation
  - Adjustable simulation speed
  - Real-time statistics updates
- Comprehensive trading metrics:
  - Win rate
  - Profit/Loss tracking
  - Maximum drawdown
  - Balance history
  - Winning/losing streaks
- Shareable results
- Multi-language support
- Newsletter subscription option

## Technologies Used

- React
- TypeScript
- i18next (Internationalization)
- Lucide React (Icons)
- Tailwind CSS (Styling)

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
```

2. Install dependencies:
```bash
cd trading-simulation
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Usage

1. Set your initial trading parameters:
   - Starting balance (minimum $100)
   - Risk percentage (0.1% - 10%)
   - Risk-to-reward ratio
   - Maximum trades per day (1-10)

2. Click "Simulate" to start the trading simulation

3. Use the controls to:
   - Pause/Resume the simulation
   - Adjust simulation speed
   - Share results

## Component Structure

```
src/
├── components/
│   ├── Layout.tsx
│   ├── SimulationForm.tsx
│   ├── SimulationResults.tsx
│   ├── NewsletterModal.tsx
│   └── ShareModal.tsx
├── utils/
│   └── simulation.ts
├── i18n/
│   └── i18n.ts
└── App.tsx
```

## Trading Simulation Parameters

### Risk Management
- Risk per trade is calculated as a percentage of current balance
- Default risk is set to 2% per trade
- Maximum risk percentage is capped at 10%

### Win Rate Calculation
- Base win rate: 45%
- Trades are randomly generated based on maximum trades per day
- Win/loss streaks are tracked and analyzed

### Balance Updates
- Profits are calculated based on risk-reward ratio
- Losses are fixed to the risk amount
- Maximum drawdown is continuously monitored

## Trading Metrics Explained

- **Successful Trades**: Number of profitable trades
- **Failed Trades**: Number of losing trades
- **Win Rate**: Percentage of successful trades
- **Longest Win Streak**: Maximum consecutive winning trades
- **Longest Loss Streak**: Maximum consecutive losing trades
- **Final Balance**: Account balance at current simulation point
- **Profit/Loss**: Net profit or loss from initial balance
- **Average Win**: Average profit per winning trade
- **Average Loss**: Average loss per losing trade
- **Max Drawdown**: Largest peak-to-trough decline in balance

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

