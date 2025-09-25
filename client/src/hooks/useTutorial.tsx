import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TutorialContextType {
  isTutorialOpen: boolean;
  startTutorial: () => void;
  closeTutorial: () => void;
  hasCompletedTutorial: boolean;
  markTutorialCompleted: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider = ({ children }: { children: ReactNode }) => {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false);

  useEffect(() => {
    // Check if user has completed tutorial before
    const completed = localStorage.getItem('calculator-tutorial-completed');
    setHasCompletedTutorial(completed === 'true');
  }, []);

  const startTutorial = () => {
    setIsTutorialOpen(true);
  };

  const closeTutorial = () => {
    setIsTutorialOpen(false);
  };

  const markTutorialCompleted = () => {
    setHasCompletedTutorial(true);
    localStorage.setItem('calculator-tutorial-completed', 'true');
    setIsTutorialOpen(false);
  };

  return (
    <TutorialContext.Provider
      value={{
        isTutorialOpen,
        startTutorial,
        closeTutorial,
        hasCompletedTutorial,
        markTutorialCompleted,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};