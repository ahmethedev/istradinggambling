import React from 'react';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import SimulationForm from './components/SimulationForm';
import SimulationResults from './components/SimulationResults';
import NewsletterModal from './components/NewsletterModal';
import ShareModal from './components/ShareModal';
import { simulationGenerator, SimulationResult } from './utils/simulation';
import { useTranslation } from 'react-i18next';
import './i18n/i18n';

interface SimulationFormValues {
  balance: number;
  riskPercentage: number;
  riskReward: number;
  maxTrades: number;
}

function App() {
  const { t } = useTranslation();
  const [simulationResults, setSimulationResults] = React.useState<SimulationResult | null>(null);
  const [showNewsletter, setShowNewsletter] = React.useState(false);
  const [showShare, setShowShare] = React.useState(false);
  const [shareImage, setShareImage] = React.useState<string | null>(null);
  const [isRunning, setIsRunning] = React.useState(false);
  const [speed, setSpeed] = React.useState(5);
  
  const simulatorRef = React.useRef<Generator<SimulationResult, void, unknown> | null>(null);
  const animationFrameRef = React.useRef<number | null>(null);

  const runSimulation = React.useCallback(() => {
    if (!simulatorRef.current) return;

    try {
      const { value, done } = simulatorRef.current.next();
      
      if (!done) {
        setSimulationResults(value);
        // Ensure next frame is scheduled
        animationFrameRef.current = window.setTimeout(
          runSimulation,
          1000 / speed
        );
      } else {
        setIsRunning(false);
      }
    } catch (error) {
      console.error('Simulation error:', error);
      setIsRunning(false);
    }
  }, [speed]);

  const handleSimulation = (values: SimulationFormValues) => {
    if (isRunning) return;

    // Clear any existing timeouts
    if (animationFrameRef.current !== null) {
      clearTimeout(animationFrameRef.current);
    }

    // Initialize new simulation
    simulatorRef.current = simulationGenerator(
      values.balance,
      values.riskReward,
      values.maxTrades,
      365 // Explicitly set to 365 days
    );
    
    setIsRunning(true);
    runSimulation();
    
    // Show newsletter modal with 50% probability
    if (Math.random() < 0.5) {
      setShowNewsletter(true);
    }
  };

  const handlePauseToggle = () => {
    if (isRunning && animationFrameRef.current !== null) {
      clearTimeout(animationFrameRef.current);
      animationFrameRef.current = null;
    } else if (!isRunning && simulatorRef.current) {
      runSimulation();
    }
    setIsRunning(!isRunning);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (isRunning && animationFrameRef.current !== null) {
      clearTimeout(animationFrameRef.current);
      animationFrameRef.current = window.setTimeout(runSimulation, 1000 / newSpeed);
    }
  };

  const handleShare = (imageUrl: string) => {
    setShareImage(imageUrl);
    setShowShare(true);
  };

  // Cleanup effect
  React.useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        clearTimeout(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-xl text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[400px,1fr]">
          <div>
            <SimulationForm 
              onSubmit={handleSimulation}
              onSpeedChange={handleSpeedChange}
              onPauseToggle={handlePauseToggle}
              isRunning={isRunning}
              speed={speed}
            />
          </div>
          {simulationResults && (
            <div>
              <SimulationResults 
                metrics={simulationResults}
                onShare={handleShare}
              />
            </div>
          )}
        </div>
      </div>

      <NewsletterModal
        isOpen={showNewsletter}
        onClose={() => setShowNewsletter(false)}
      />

      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        imageUrl={shareImage}
      />
      
      <Toaster position="top-right" />
    </Layout>
  );
}

export default App;