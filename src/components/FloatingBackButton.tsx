import './FloatingBackButton.css';

interface FloatingBackButtonProps {
  onClick: () => void;
}

const FloatingBackButton: React.FC<FloatingBackButtonProps> = ({ onClick }) => (
  <button
    type="button"
    className="floating-back-button"
    onClick={onClick}
    aria-label="もどる"
  >
    <span aria-hidden="true">←</span> もどる
  </button>
);

export default FloatingBackButton;
