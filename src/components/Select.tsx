import * as React from 'react';
import { Listbox } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { joinClassNames } from 'utils/class';

type Option = string | number;
type ChangeHandler = React.Dispatch<React.SetStateAction<Option>>;

export const Select: React.FC<{
  options: Option[];
  className?: string;
  id?: string;
  onChange: ChangeHandler;
}> = props => {
  const { options, className, onChange, ...restProps } = props;
  const [selected, setSelected] = React.useState(options[0]);
  const handleChange = React.useCallback<ChangeHandler>(
    option => {
      setSelected(option);
      onChange(option);
    },
    [onChange]
  );

  return (
    <Listbox
      as="div"
      value={selected}
      onChange={handleChange}
      className={joinClassNames(className, 'w-32')}
      {...restProps}
    >
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-200 rounded-lg border-2 border-gray-700 shadow-md cursor-pointer sm:text-sm">
          <span className="block truncate">{selected}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <SelectorIcon
              className="w-5 h-5 text-gray-700"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 sm:text-sm">
          {options.map((option, personIdx) => (
            <Listbox.Option
              key={personIdx}
              className={({ active }) =>
                `${active ? 'text-blue-900 bg-blue-100' : 'text-gray-900'}
                          cursor-pointer select-none relative py-2 pl-8 pr-4`
              }
              value={option}
            >
              {({ selected, active }) => (
                <>
                  <span
                    className={`${
                      selected ? 'font-medium' : 'font-normal'
                    } block truncate text-left pl-1`}
                  >
                    {option}
                  </span>
                  {selected ? (
                    <span
                      className={`${
                        active ? 'text-blue-600' : 'text-blue-600'
                      } absolute inset-y-0 left-0 flex items-center pl-2`}
                    >
                      <CheckIcon className="w-5 h-5" aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};
