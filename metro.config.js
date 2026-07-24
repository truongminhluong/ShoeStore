const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure .ttf fonts are recognized as assets
config.resolver = config.resolver || {};
config.resolver.assetExts = config.resolver.assetExts || [];
if (!config.resolver.assetExts.includes('ttf')) {
    config.resolver.assetExts.push('ttf');
}

module.exports = config;
