import Joyride, { Step, STATUS } from 'react-joyride';
import { useTutorial } from '@/hooks/useTutorial';

const tutorialSteps: Step[] = [
  {
    target: '[data-testid="property-type-selection"]',
    content: 'Start by selecting your property type. This will automatically select Required items and highlight Recommended ones for your property type.',
    title: 'Step 1: Choose Property Type',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '[data-testid="row-disbursement-professional-fees"] .flex',
    content: 'Required items show a red lock icon 🔒 and Recommended items show an orange bookmark icon 🔖. Hover over the icons to see tooltips.',
    title: 'Step 2: Understanding Icons',
    placement: 'right',
  },
  {
    target: '[data-testid="checkbox-item-professional-fees"]',
    content: 'Check or uncheck items to include them in your calculation. Adjust quantities using the input field in the Qty column.',
    title: 'Step 3: Select Items & Quantities',
    placement: 'right',
  },
  {
    target: '[data-testid="button-add-custom-item"]',
    content: 'Need something not listed? Click here to add custom items with your own description and cost.',
    title: 'Step 4: Add Custom Items',
    placement: 'top',
  },
  {
    target: '[data-testid="card-totals"]',
    content: 'Your totals are calculated automatically, showing subtotal, GST, and total including GST. All amounts are in AUD.',
    title: 'Step 5: Review Totals',
    placement: 'left',
  },
  {
    target: '[data-testid="button-print"]',
    content: 'When ready, print your estimate or reset the calculator to start over. That completes our tour!',
    title: 'Step 6: Print or Reset',
    placement: 'top',
  },
];

export default function Tutorial() {
  const { isTutorialOpen, closeTutorial, markTutorialCompleted } = useTutorial();

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      markTutorialCompleted();
    }
  };

  return (
    <Joyride
      steps={tutorialSteps}
      run={isTutorialOpen}
      continuous
      showSkipButton
      showProgress
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#f47424',
          backgroundColor: '#fff',
          textColor: '#333',
          overlayColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1000,
        },
        tooltip: {
          borderRadius: 8,
          fontSize: 14,
        },
        buttonNext: {
          backgroundColor: '#f47424',
          color: '#fff',
          fontSize: 14,
          borderRadius: 6,
          padding: '8px 16px',
        },
        buttonBack: {
          color: '#f47424',
          fontSize: 14,
          borderRadius: 6,
          padding: '8px 16px',
        },
        buttonSkip: {
          color: '#666',
          fontSize: 14,
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tutorial',
      }}
    />
  );
}