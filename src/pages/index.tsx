import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { joinClassNames } from '../utils/class';

const VALID_FILE_TYPES = ['image/gif', 'video/mp4'];

const FileDropZone: React.FC<{
  className?: string;
  onFileLoaded(file: File): void;
}> = props => {
  const handleDrop = (files: File[]) => {
    console.log('File dropped', files);
    if (files.length !== 1) {
      console.log('Please only upload 1 file');
      return;
    }
    const file = files[0];

    if (!VALID_FILE_TYPES.includes(file.type)) {
      console.log('Invalid file type');
      return;
    }

    props.onFileLoaded(file);
  };
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.log('File in drop zone');
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    onDragOver: handleDragOver,
    multiple: false,
  });

  return (
    <div
      className={joinClassNames(
        'w-40 h-40 bg-gray-400 border-gray-900 rounded-lg border-2 flex items-center content-center cursor-pointer',
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

  return (
    <div className="flex flex-col items-center text-center font-mono">
      <h1 className="text-4xl font-bold mt-8">GIF Creator</h1>
      <FileDropZone
        className="mt-8"
        onFileLoaded={file => {
          setSourceVideo(file);
        }}
      />
      {sourceVideo && (
        <div className="mt-8">
          <h2 className="text-xl mb-2">Preview</h2>
          {sourceVideo.type === 'video/mp4' ? (
            <video
              controls
              autoPlay
              loop
              width={300}
              src={URL.createObjectURL(sourceVideo)}
            ></video>
          ) : (
            <img src={URL.createObjectURL(sourceVideo)} alt="" width={300} />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
