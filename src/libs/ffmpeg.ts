import * as React from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg();

const SOURCE_FILE_NAME = 'source.mp4';
const RESULT_FILE_NAME = 'target.gif';

export type FrameRate = 24 | 12 | 8 | null;
export type Resolution = 1.0 | 0.75 | 0.5 | 0.25;

type GifResult = {
  url: string;
  size: number;
};

type ConvertToGif = (
  source: File,
  options: {
    frameRate: FrameRate;
    resolution: Resolution;
  }
) => Promise<void>;

export function useGifConverter(): {
  ready: boolean;
  processing: boolean;
  result: GifResult | null;
  convertToGif: ConvertToGif;
} {
  const [ready, setReady] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);
  const [result, setResult] = React.useState<GifResult | null>(null);

  const load = React.useCallback(async () => {
    if (ffmpeg.isLoaded()) {
      setReady(true);
      return;
    }

    await ffmpeg.load();
    setReady(true);
  }, []);

  React.useEffect(() => {
    load();
  }, []);

  const convertToGif = React.useCallback<ConvertToGif>(
    async (source, options) => {
      setProcessing(true);
      try {
        const sourceBinary = await fetchFile(source);
        ffmpeg.FS('writeFile', SOURCE_FILE_NAME, sourceBinary);
        await ffmpeg.run(
          '-i',
          SOURCE_FILE_NAME,
          '-vf',
          `scale=iw*${options.resolution}:ih*${options.resolution}${
            options.frameRate ? `,fps=${options.frameRate}` : ''
          }`,
          '-f',
          'gif',
          RESULT_FILE_NAME
        );
        const resultBinary = ffmpeg.FS('readFile', RESULT_FILE_NAME);
        const resultBlob = new Blob([resultBinary.buffer], {
          type: 'image/gif',
        });
        const resultURL = URL.createObjectURL(resultBlob);
        setResult({ url: resultURL, size: resultBlob.size });
        setProcessing(false);
      } catch {
        setProcessing(false);
      }
    },
    []
  );

  return { ready, processing, result, convertToGif };
}
