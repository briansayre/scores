import React from 'react';
import './PageNavigation.css';
import { PageType } from '../../types';

interface PageNavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export const PageNavigation: React.FC<PageNavigationProps> = ({ 
  currentPage, 
  onPageChange 
}) => {
  const pages: { id: PageType; label: string }[] = [
    { id: 'scores', label: 'Scores' },
    { id: 'teams', label: 'Teams' },
    { id: 'news', label: 'News' }
  ];

  return (
    <nav className="page-navigation">
      <div className="page-nav-container">
        <div className="site-title">BSPN</div>
        <div className="page-nav-buttons">
          {pages.map((page) => (
            <button
              key={page.id}
              className={`page-nav-button ${currentPage === page.id ? 'active' : ''}`}
              onClick={() => onPageChange(page.id)}
            >
              {page.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
