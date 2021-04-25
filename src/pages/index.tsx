import * as React from 'react';
import { Button } from 'components/Button';
import { FileDropZoneProps, FileDropZone } from 'components/FileDropZone';
import { WarningDialog } from 'components/WarningDialog';
import {
  FrameRate,
  Resolution as Resolution,
  useGifConverter,
} from 'libs/ffmpeg';
import { formatBytes } from 'utils/math';
import { Select } from 'components/Select';

type FrameRateOptions = { text: string; value: FrameRate };
type ResolutionOptions = { text: string; value: Resolution };
const frameRateOptions: FrameRateOptions[] = [
  { text: 'Default', value: null },
  { text: '24 fps', value: 24 },
  { text: '12 fps', value: 12 },
  { text: '8 fps', value: 8 },
];
const resolutionOptions: ResolutionOptions[] = [
  { text: '1.0', value: 1.0 },
  { text: '0.75', value: 0.75 },
  { text: '0.5', value: 0.5 },
  { text: '0.25', value: 0.25 },
];

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

  const [frameRate, setFrameRate] = React.useState<FrameRate>(null);
  const [resolution, setResolution] = React.useState<Resolution>(1.0);
  const handleChangeFrameRate = React.useCallback(
    (frameRateOption: FrameRateOptions) => {
      setFrameRate(frameRateOption.value);
    },
    []
  );
  const handleChangeResolution = React.useCallback(
    (resolutionOption: ResolutionOptions) => {
      setResolution(resolutionOption.value);
    },
    []
  );

  const { ready, processing, result, convertToGif } = useGifConverter();
  const handleClickConvertToGif = React.useCallback(() => {
    if (sourceVideo === null) {
      return;
    }
    convertToGif(sourceVideo, { frameRate, resolution });
  }, [sourceVideo, convertToGif, frameRate, resolution]);

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-4xl font-bold">To GIF</h1>
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
              <section className="mt-6">
                <Button
                  processing={processing}
                  onClick={handleClickConvertToGif}
                >
                  Convert to GIF
                </Button>
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
