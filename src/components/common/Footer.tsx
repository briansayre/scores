import React from 'react';

interface FooterProps {
  gameCount: number;
  totalGames: number;
  gamesFailed: number;
}

export const Footer: React.FC<FooterProps> = ({
  gameCount,
  totalGames,
  gamesFailed
}) => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="game-count">
          Showing {gameCount} of {totalGames} games
          {gamesFailed > 0 && (
            <span className="failed-count"> ({gamesFailed} failed)</span>
          )}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
