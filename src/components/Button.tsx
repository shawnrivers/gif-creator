import * as React from 'react';
import { joinClassNames } from 'utils/class';

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = props => {
  const { className, ...restProps } = props;
  return (
    <button
      className={joinClassNames(
        'px-4 py-2 text-sm bg-gray-600 text-white border border-transparent rounded-md',
        className
      )}
      {...restProps}
    ></button>
  );
};
