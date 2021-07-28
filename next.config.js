module.exports = {
  future: {
    webpack5: true,
  },
  async headers() {
    // Add cross-origin headers because SharedArrayBuffer is 
    // limited to cross-origin isolated pages after Chrome 92.
    // https://github.com/ffmpegwasm/ffmpeg.wasm/issues/231
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
};
