import { FileDropZoneProps, FileDropZone } from 'components/FileDropZone';
import { WarningDialog } from 'components/WarningDialog';
import * as React from 'react';

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
      <h1 className="text-4xl font-bold">GIF Creator</h1>
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
