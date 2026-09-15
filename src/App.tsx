import React from 'react';
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { Footer } from './components/Footer/Footer';

export const App: React.FC = () => {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Hero />
      </main>
      <Footer />
    </>
  );
};

export default App;
