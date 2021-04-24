import * as React from 'react';

import { Button } from 'components/Button';
import { FileDropZoneProps, FileDropZone } from 'components/FileDropZone';
import { WarningDialog } from 'components/WarningDialog';
import { useGifConverter } from 'libs/ffmpeg';
import { formatBytes } from 'utils/math';

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
  const handleCloseWarningDialog = React.useCallback(() => {
    setIsWarningDialogOpen(false);
  }, []);

  const { ready, result, convertToGif } = useGifConverter();
  const handleClickConvertToGif = React.useCallback(() => {
    if (sourceVideo === null) {
      return;
    }
    convertToGif(sourceVideo);
  }, [sourceVideo, convertToGif]);

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
          <section>
            <h2 className="text-xl mb-2">Source Video Preview</h2>
            <video
              controls
              autoPlay
              loop
              width={300}
              src={URL.createObjectURL(sourceVideo)}
            ></video>
            <p className="mt-2">Source size: {formatBytes(sourceVideo.size)}</p>
          </section>
          {ready && (
            <Button className="mt-8" onClick={handleClickConvertToGif}>
              Convert to GIF
            </Button>
          )}
          {result && (
            <section className="mt-8">
              <h2 className="text-xl mb-2">Result GIF Preview</h2>
              <a href={result.url} download className="cursor-pointer">
                <img width={300} src={result.url} alt="Result GIF" />
              </a>
              <p className="mt-2">Result size: {formatBytes(result.size)}</p>
            </section>
          )}
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
