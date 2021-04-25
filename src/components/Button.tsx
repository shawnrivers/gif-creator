import * as React from 'react';
import { joinClassNames } from 'utils/class';

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    processing?: boolean;
    children: React.ReactNode;
  }
> = props => {
  const { className, children, processing, ...restProps } = props;
  return (
    <button
      className={joinClassNames(
        `inline-flex items-center justify-center px-4 py-2 ${
          processing ? 'bg-red-500' : 'bg-gray-600'
        } text-white shadow-md rounded-md focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-indigo-300`,
        className
      )}
      disabled={processing}
      {...restProps}
    >
      {processing && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      <span>{processing ? 'Processing...' : children}</span>
    </button>
  );
};
