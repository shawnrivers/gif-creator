import * as React from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg();

const SOURCE_FILE_NAME = 'source.mp4';
const RESULT_FILE_NAME = 'target.gif';

type GifResult = {
  url: string;
  size: number;
};

export function useGifConverter(): {
  ready: boolean;
  result: GifResult | null;
  convertToGif(source: File): Promise<void>;
} {
  const [ready, setReady] = React.useState(false);
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
    const sourceBinary = await fetchFile(source);
    ffmpeg.FS('writeFile', SOURCE_FILE_NAME, sourceBinary);
    await ffmpeg.run('-i', SOURCE_FILE_NAME, '-f', 'gif', RESULT_FILE_NAME);
    const resultBinary = ffmpeg.FS('readFile', RESULT_FILE_NAME);
    const resultBlob = new Blob([resultBinary.buffer], { type: 'image/gif' });
    const resultURL = URL.createObjectURL(resultBlob);
    setResult({ url: resultURL, size: resultBlob.size });
  }, []);

  return { ready, result, convertToGif };
}
