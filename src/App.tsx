import { useState } from 'react';
import './App.css';
import HomeScreen, { Mode } from './screens/HomeScreen';
import NurieScreen from './screens/NurieScreen';
import OekakiScreen from './screens/OekakiScreen';

type Screen = 'home' | Mode;

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const goHome = () => setScreen('home');

  if (screen === 'nurie') return <NurieScreen onBackHome={goHome} />;
  if (screen === 'oekaki') return <OekakiScreen onBackHome={goHome} />;
  return <HomeScreen onSelect={setScreen} />;
}

export default App;
