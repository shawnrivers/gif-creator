import 'focus-visible';
import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>To GIF</title>
        <meta name="title" content="To GIF" />
        <meta
          name="description"
          content="A web app that generates GIF from video file using FFmpeg WASM"
        />
        <meta name="url" content="togif.vercel.app" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="og:title" content="To GIF" />
        <meta
          name="og:description"
          content="A web app that generates GIF from video file using FFmpeg WASM"
        />
        <meta name="og:type" content="website" />
        <meta name="og:url" content="togif.vercel.app" />
        <meta name="og:image:alt" content="To GIF" />
        <meta name="twitter:creator" content="@yuxiao_he" />
        <meta name="twitter:card" content="summary" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </Head>
      <main className="font-mono text-gray-900 px-4 py-8">
        <Component {...pageProps} />
      </main>
    </>
  );
};

export default MyApp;
