import React from 'react';
import './App.css';
import { useLocalStorage } from './hooks/useLocalStorage';
import { PageType } from './types';
import { PageNavigation } from './components/common/PageNavigation';
import { ScoresPage, TeamsPage, NewsPage } from './pages';

function App() {
  const [currentPage, setCurrentPage] = useLocalStorage<PageType>('currentPage', 'scores');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'scores':
        return <ScoresPage />;
      case 'teams':
        return <TeamsPage />;
      case 'news':
        return <NewsPage />;
      default:
        return <ScoresPage />;
    }
  };

  return (
    <div className="App">
      <PageNavigation 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      
      {renderCurrentPage()}
    </div>
  );
}

export default App;
