exports.config = {
  copy: [
    { src: 'web.config' }
  ],
  outputTargets: [
    {
      type: 'www',
      serviceWorker: {
        swSrc: 'src/sw.js'
      }
    }
  ],
  globalStyle: 'src/global.css'
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
