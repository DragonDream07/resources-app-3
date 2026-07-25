import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  { id: 'address', label: 'Address' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

/**
 * CheckoutStepper
 * Props:
 *   currentStep: 'address' | 'payment' | 'review'
 */
const CheckoutStepper = ({ currentStep }) => {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="Checkout steps" className="w-full">
      <ol className="flex items-center justify-center gap-0">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isLast = index === STEPS.length - 1;

          return (
            <React.Fragment key={step.id}>
              <li className="flex flex-col items-center">
                <div
                  className={[
                    'flex items-center justify-center w-9 h-9 rounded-full border-2 text-sm font-semibold transition-colors',
                    isCompleted
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : isActive
                      ? 'bg-white border-indigo-600 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-400',
                  ].join(' ')}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={[
                    'mt-1.5 text-xs font-medium whitespace-nowrap',
                    isActive ? 'text-indigo-600' : isCompleted ? 'text-indigo-500' : 'text-gray-400',
                  ].join(' ')}
                >
                  {step.label}
                </span>
              </li>

              {!isLast && (
                <li
                  aria-hidden="true"
                  className={[
                    'flex-1 h-0.5 mx-2 mb-5 transition-colors',
                    index < currentIndex ? 'bg-indigo-600' : 'bg-gray-200',
                  ].join(' ')}
                />
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default CheckoutStepper;
