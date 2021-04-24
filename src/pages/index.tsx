import { WarningDialog } from 'components/WarningDialog';
import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { joinClassNames } from 'utils/class';

const VALID_FILE_TYPES = ['video/mp4'];

type FileDropZoneProps = {
  className?: string;
  onFileLoaded(file: File): void;
  onFileLoadFailed(message: string): void;
};

const FileDropZone: React.FC<FileDropZoneProps> = props => {
  const { onFileLoaded, onFileLoadFailed } = props;

  const handleDrop = React.useCallback(
    (files: File[]) => {
      if (files.length !== 1) {
        onFileLoadFailed(
          "You' are trying to upload too many files. Please only upload one file once."
        );
        return;
      }

      const file = files[0];

      if (!VALID_FILE_TYPES.includes(file.type)) {
        onFileLoadFailed('Invalid file type.');
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
        `w-40 h-40 ${
          isDragActive
            ? 'bg-gray-200 border-gray-500 border-dashed'
            : 'bg-gray-400 border-gray-900 border-solid'
        } rounded-lg border-2 flex items-center content-center cursor-pointer`,
        props.className
      )}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <p className="text-xl text-center">Drop file here</p>
    </div>
  );
};

const Home: React.FC = () => {
  const [sourceVideo, setSourceVideo] = React.useState<File>();
  const [isWarningDialogOpen, setIsWarningDialogOpen] = React.useState(false);
  const [warningText, setWarningText] = React.useState('');

  const handleFileUploadFail = React.useCallback<
    FileDropZoneProps['onFileLoadFailed']
  >(
    message => {
      setSourceVideo(null);
      setWarningText(message);
      setIsWarningDialogOpen(true);
    },
    [setIsWarningDialogOpen, setWarningText]
  );

  const handleCloseWarningDialog = () => {
    setIsWarningDialogOpen(false);
  };

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-4xl font-bold mt-8">GIF Creator</h1>
      <FileDropZone
        className="mt-8"
        onFileLoaded={file => {
          setSourceVideo(file);
        }}
        onFileLoadFailed={handleFileUploadFail}
      />
      {sourceVideo && (
        <div className="mt-8">
          <h2 className="text-xl mb-2">Source Video Preview</h2>
          <video
            controls
            autoPlay
            loop
            width={300}
            src={URL.createObjectURL(sourceVideo)}
          ></video>
        </div>
      )}
      <WarningDialog
        open={isWarningDialogOpen}
        text={warningText}
        onClose={handleCloseWarningDialog}
      ></WarningDialog>
    </div>
  );
};

export default Home;
