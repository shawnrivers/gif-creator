import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <main className="font-mono text-gray-900 px-4 py-8">
      <Component {...pageProps} />
    </main>
  );
};

export default MyApp;
