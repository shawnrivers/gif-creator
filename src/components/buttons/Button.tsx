import { joinClassNames } from 'utils/class';

type ButtonProps = (
  | ({
      component: 'button';
    } & React.ButtonHTMLAttributes<HTMLButtonElement>)
  | ({
      component: 'a';
    } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
) & {
  children: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = props => {
  if (props.component === 'button') {
    const { component, className, children, ...buttonProps } = props;
    return (
      <button
        className={joinClassNames(
          'inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white shadow-md rounded-md focus-visible:ring-4 focus:outline-none focus-visible:ring-offset-2 focus-visible:ring-indigo-300 hover:bg-gray-500 disabled:opacity-80',
          className
        )}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }

  const { component, className, children, ...anchorProps } = props;
  return (
    <a
      className={joinClassNames(
        'inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white shadow-md rounded-md focus-visible:ring-4 focus:outline-none focus-visible:ring-offset-2 focus-visible:ring-indigo-300 hover:bg-gray-500',
        className
      )}
      {...anchorProps}
    >
      {children}
    </a>
  );
};
