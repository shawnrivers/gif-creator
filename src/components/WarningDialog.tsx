import * as React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from './buttons/Button';

type WarningDialogProps = {
  open: boolean;
  text: string;
  onClose(): void;
};

export const WarningDialog: React.FC<WarningDialogProps> = props => {
  const { open } = props;

  return (
    <Transition show={open} as={React.Fragment}>
      <Dialog
        className="fixed inset-0 z-10 overflow-y-auto font-mono"
        static
        open={open}
        onClose={props.onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            as={React.Fragment}
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-center align-middle transition-all transform bg-white border-2 border-gray-800 shadow-xl rounded-2xl">
              <Dialog.Title as="h2" className="text-2xl text-gray-600">
                WARNING
              </Dialog.Title>
              <Dialog.Description className="text-xl mt-4 text-gray-900 whitespace-pre-wrap">
                {props.text}
              </Dialog.Description>
              <Button
                component="button"
                className="mt-4"
                onClick={props.onClose}
              >
                OK
              </Button>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
