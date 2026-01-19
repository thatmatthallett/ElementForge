export default {
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        eventLogger: 'src/eventLogger.ts'
      }
    }
  }
};
