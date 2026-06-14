import './HomeScreen.css';

export type Mode = 'nurie' | 'oekaki';

interface HomeScreenProps {
  onSelect: (mode: Mode) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onSelect }) => (
  <div className="home-container">
    <h1 className="home-title">なにして あそぶ？</h1>
    <div className="home-buttons">
      <button className="home-button home-button--nurie" onClick={() => onSelect('nurie')}>
        <span className="home-icon">🎨</span>
        <span className="home-label">ぬりえ</span>
      </button>
      <button className="home-button home-button--oekaki" onClick={() => onSelect('oekaki')}>
        <span className="home-icon">✏️</span>
        <span className="home-label">おえかき</span>
      </button>
    </div>
  </div>
);

export default HomeScreen;
