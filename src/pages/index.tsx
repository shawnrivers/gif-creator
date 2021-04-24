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

  const handleLoadFile = React.useCallback((file: File) => {
    setSourceVideo(file);
  }, []);
  const handleFileLoadFail = React.useCallback<
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

  const { ready, processing, result, convertToGif } = useGifConverter();
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
        onFileLoaded={handleLoadFile}
        onFileLoadFailed={handleFileLoadFail}
      />
      {sourceVideo && (
        <div className="mt-8 flex flex-col justify-center">
          <section>
            <h2 className="text-xl font-bold mb-2">Source Video Preview</h2>
            <video
              controls
              autoPlay
              loop
              className="w-80 h-80 object-contain"
              src={URL.createObjectURL(sourceVideo)}
            ></video>
            <p className="mt-2">Source size: {formatBytes(sourceVideo.size)}</p>
          </section>
          {ready && (
            <div>
              <Button
                className="mt-8"
                processing={processing}
                onClick={handleClickConvertToGif}
              >
                Convert to GIF
              </Button>
            </div>
          )}
          {result && (
            <section className="mt-8">
              <h2 className="text-xl font-bold mb-2">Result</h2>
              <a href={result.url} download className="cursor-pointer">
                <img
                  src={result.url}
                  alt="Result GIF"
                  className="w-80 h-80 object-contain"
                />
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
