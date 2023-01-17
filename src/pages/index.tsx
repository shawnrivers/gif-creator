import { ProcessButton } from 'components/buttons/ProcessButton';
import { FileDropZoneProps, FileDropZone } from 'components/FileDropZone';
import { WarningDialog } from 'components/WarningDialog';
import {
  FrameRate,
  Resolution as Resolution,
  useGifConverter,
} from 'libs/ffmpeg';
import { formatBytes } from 'utils/math';
import { Select } from 'components/Select';
import { Button } from 'components/buttons/Button';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useState, useCallback } from 'react';

type FrameRateOptions = { text: string; value: FrameRate };
type ResolutionOptions = { text: string; value: Resolution };
const frameRateOptions: FrameRateOptions[] = [
  { text: 'Default', value: null },
  { text: '24 fps', value: 24 },
  { text: '12 fps', value: 12 },
  { text: '8 fps', value: 8 },
];
const resolutionOptions: ResolutionOptions[] = [
  { text: '* 1.0', value: 1.0 },
  { text: '* 0.8', value: 0.8 },
  { text: '* 0.6', value: 0.6 },
  { text: '* 0.4', value: 0.4 },
  { text: '* 0.2', value: 0.2 },
];

const Home: React.FC = () => {
  const [sourceVideo, setSourceVideo] = useState<File>();
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);
  const [warningText, setWarningText] = useState('');

  const handleLoadFile = useCallback((file: File) => {
    setSourceVideo(file);
  }, []);
  const handleFileLoadFail = useCallback<FileDropZoneProps['onFileLoadFailed']>(
    message => {
      setSourceVideo(null);
      setWarningText(message);
      setIsWarningDialogOpen(true);
    },
    [setIsWarningDialogOpen, setWarningText]
  );
  const handleCloseWarningDialog = useCallback(() => {
    setIsWarningDialogOpen(false);
  }, []);

  const [frameRate, setFrameRate] = useState<FrameRate>(null);
  const [resolution, setResolution] = useState<Resolution>(1.0);
  const handleChangeFrameRate = useCallback(
    (frameRateOption: FrameRateOptions) => {
      setFrameRate(frameRateOption.value);
    },
    []
  );
  const handleChangeResolution = useCallback(
    (resolutionOption: ResolutionOptions) => {
      setResolution(resolutionOption.value);
    },
    []
  );

  const { ready, processing, result, convertToGif } = useGifConverter();
  const handleClickConvertToGif = useCallback(() => {
    if (sourceVideo === null) {
      return;
    }
    convertToGif(sourceVideo, { frameRate, resolution });
  }, [sourceVideo, convertToGif, frameRate, resolution]);

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-4xl font-bold">To GIF - Convert video to GIF</h1>
      <FileDropZone
        className="mt-8"
        onFileLoaded={handleLoadFile}
        onFileLoadFailed={handleFileLoadFail}
      />
      {sourceVideo && (
        <div className="mt-8 flex flex-col justify-center">
          <section>
            <h2 className="text-xl font-bold mb-2">Source Video Preview</h2>
            {sourceVideo.type === 'image/gif' ? (
              <img
                src={URL.createObjectURL(sourceVideo)}
                alt="Source video"
                className="w-80 h-72 object-contain"
              />
            ) : (
              <video
                controls
                autoPlay
                loop
                className="w-80 h-72 object-contain"
                src={URL.createObjectURL(sourceVideo)}
              ></video>
            )}
            <p className="mt-2">Source size: {formatBytes(sourceVideo.size)}</p>
          </section>
          {ready && (
            <>
              <section className="mt-8">
                <h3 className="text-lg font-semibold">Options</h3>
                <div className="flex flex-wrap justify-center mt-2">
                  <div className="m-2">
                    <label htmlFor="fps">Frame rate</label>
                    <Select
                      id="fps"
                      options={frameRateOptions}
                      className="mt-2"
                      onChange={handleChangeFrameRate}
                    />
                  </div>
                  <div className="m-2">
                    <label htmlFor="fps">Resolution</label>
                    <Select
                      id="fps"
                      options={resolutionOptions}
                      className="mt-2"
                      onChange={handleChangeResolution}
                    />
                  </div>
                </div>
              </section>
              <section className="mt-4">
                <ProcessButton
                  processing={processing}
                  onClick={handleClickConvertToGif}
                >
                  Convert to GIF
                </ProcessButton>
              </section>
            </>
          )}
          {result && (
            <section className="mt-8">
              <h2 className="text-xl font-bold mb-2">Result</h2>
              <a href={result.url} download className="cursor-pointer">
                <img
                  src={result.url}
                  alt="Result GIF"
                  className="w-80 h-72 object-contain"
                />
              </a>
              <p className="mt-2">Result size: {formatBytes(result.size)}</p>
              <Button component="a" href={result.url} download className="mt-4">
                <div className="flex items-center">
                  <ArrowDownTrayIcon className="w-5 h-5" aria-hidden />
                  <span className="ml-2">Download Result</span>
                </div>
              </Button>
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
