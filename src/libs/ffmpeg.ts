import * as React from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg();

const SOURCE_FILE_NAME = 'source.mp4';
const RESULT_FILE_NAME = 'target.gif';

export type FrameRate = 'Default' | '24 fps' | '12 fps' | '8 fps';
export type Resolution = '1.0' | '0.75' | '0.5';
export const FRAME_RATE_OPTIONS: FrameRate[] = [
  'Default',
  '24 fps',
  '12 fps',
  '8 fps',
];
export const RESOLUTION_OPTIONS: Resolution[] = ['1.0', '0.75', '0.5'];

type GifResult = {
  url: string;
  size: number;
};

export function useGifConverter(): {
  ready: boolean;
  processing: boolean;
  result: GifResult | null;
  convertToGif(source: File): Promise<void>;
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

  const convertToGif = React.useCallback(async (source: File) => {
    setProcessing(true);
    try {
      const sourceBinary = await fetchFile(source);
      ffmpeg.FS('writeFile', SOURCE_FILE_NAME, sourceBinary);
      await ffmpeg.run(
        '-i',
        SOURCE_FILE_NAME,
        '-vf',
        'fps=10,scale=iw*0.5:ih*0.5',
        '-f',
        'gif',
        RESULT_FILE_NAME
      );
      const resultBinary = ffmpeg.FS('readFile', RESULT_FILE_NAME);
      const resultBlob = new Blob([resultBinary.buffer], { type: 'image/gif' });
      const resultURL = URL.createObjectURL(resultBlob);
      setResult({ url: resultURL, size: resultBlob.size });
      setProcessing(false);
    } catch {
      setProcessing(false);
    }
  }, []);

  return { ready, processing, result, convertToGif };
}
