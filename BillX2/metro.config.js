const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getDefaultConfig(__dirname);

  // Extended configuration for react-native-svg-transformer
  const extraConfig = {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer')
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'), // Exclude 'svg' from assetExts
      sourceExts: [...sourceExts, 'svg'] // Include 'svg' in sourceExts
    }
  };

  return mergeConfig(getDefaultConfig(__dirname), extraConfig);
})();