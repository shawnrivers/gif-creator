import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import type { DropzoneOptions } from 'react-dropzone';
import { joinClassNames } from 'utils/class';
import { VALID_VIDEO_FILE_TYPES } from 'libs/ffmpeg';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export type FileDropZoneProps = {
  className?: string;
  onFileLoaded(file: File): void;
  onFileLoadFailed(message: string): void;
};

export const FileDropZone: React.FC<FileDropZoneProps> = props => {
  const { onFileLoaded, onFileLoadFailed } = props;

  const handleDrop = React.useCallback<DropzoneOptions['onDrop']>(
    files => {
      if (files.length !== 1) {
        onFileLoadFailed('Please only upload one file at a time.');
        return;
      }

      const file = files[0];

      if (!VALID_VIDEO_FILE_TYPES.includes(file.type)) {
        onFileLoadFailed(
          'Invalid file type.\nThe available file formats are\n.mp4, .mov, .gif'
        );
        return;
      }

      onFileLoaded(file);
    },
    [onFileLoadFailed, onFileLoaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
  });

  return (
    <div
      className={joinClassNames(
        `${
          isDragActive
            ? 'bg-gray-200 border-gray-500 border-dashed'
            : 'bg-gray-400 border-gray-900 border-solid'
        } max-w-4xl min-h-full px-8 py-8 rounded-lg border-2 shadow-md flex flex-col items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-indigo-300 hover:bg-gray-300`,
        props.className
      )}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <ArrowUpTrayIcon className="w-7 h-7 text-gray-900" aria-hidden />
      <p className="text-xl mt-4">
        Drop file here or click
        <br />
        to upload a video file
      </p>
    </div>
  );
};
