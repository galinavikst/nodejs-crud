import path from 'path';

export default {
  mode: 'production', // Set the mode to production for minification
  entry: './dist/server.js',
  target: 'node', // Specify that you're targeting a Node.js environment
  output: {
    filename: 'BUNDLE.js',
    path: path.resolve('dist'), // Output directory
  },
  resolve: {
    extensions: ['.js'], // Resolve these file extensions
  },
};
