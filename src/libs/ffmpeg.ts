import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { useState, useCallback, useEffect } from 'react';

const ffmpeg = createFFmpeg(
  process.env.NODE_ENV !== 'production' ? { log: true } : undefined
);

export const VALID_VIDEO_FILE_TYPES = [
  'video/mp4',
  'video/quicktime',
  'image/gif',
];

const RESULT_FILE_NAME = 'target.gif';

export type FrameRate = 24 | 12 | 8 | null;
export type Resolution = 1.0 | 0.8 | 0.6 | 0.4 | 0.2;

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
  const [ready, setReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<GifResult | null>(null);

  const load = useCallback(async () => {
    if (ffmpeg.isLoaded()) {
      setReady(true);
      return;
    }

    await ffmpeg.load();
    setReady(true);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const convertToGif = useCallback<ConvertToGif>(async (source, options) => {
    setProcessing(true);
    try {
      const sourceBinary = await fetchFile(source);
      ffmpeg.FS('writeFile', source.name, sourceBinary);
      await ffmpeg.run(
        '-i',
        source.name,
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
  }, []);

  return { ready, processing, result, convertToGif };
}
