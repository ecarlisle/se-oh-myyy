'use strict';

// Node native modules
const path = require('path');

// To access native Webpack plugins
const webpack = require('webpack');

// Webpack plugins
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Hugo variables
const themeName = 'podium';
// Paths
const sourcePath = path.resolve(__dirname, 'src' );
const buildPath = path.resolve(__dirname);
const cssPath = path.resolve(buildPath, 'css');
const jsPath = path.resolve(buildPath, 'js');
const fontPath = path.resolve(buildPath, 'fonts');

module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				enforce: 'pre',
				exclude: /node_modules/,
				use: [
					{
						loader: 'jshint-loader'
					}
				],
			},
			{
				test: /\.(scss|css)$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								sourceMap: false,
								minimize: false,
								importLoaders: 2,
							},
						},
						{
							loader: 'postcss-loader',
							options: {
								plugins: () => [
									require('autoprefixer')(),
									// require('css-mqpacker'),
									// require('cssnano'),
								],
								sourceMap: false,
							},
						},
						{
							loader: 'sass-loader',
							options: {
								outputStyle: 'expanded',
								sourceMap: false,
							}
						},
					],
				}),
			},
			{
				test: /\.(woff|woff2)$/,
				use: {
					loader: 'file-loader',
					options: {
						mimetype: 'application/font-woff',
						name: '/fonts/[name].[ext]',
					},
				},
			},
			{
				test: /\.(ttf)$/,
				use: {
					loader: 'file-loader',
					options: {
						mimetype: 'application/font-ttf',
						name: '/fonts/[name].[ext]',
					},
				},
			},
		], // :rules
	},
  externals: {
    'Reveal': 'reveal.js',
  },
	context: sourcePath,
	entry: {
		app: [
			'normalize.css/normalize.css',
			'reveal.js',
			'reveal.js/css/reveal.css',
			'reveal.js/css/theme/simple.css',
			'highlight.js/styles/monokai.css',
			'highlight.js',
			'./scss/main.scss',
			'jquery',
			'./js/main.js',
		],
	},
	output: {
		path: path.resolve(buildPath),
		filename: './js/main.js',
	},
	watch: true,
	devtool: 'source-map',
	plugins: [
		new CleanWebpackPlugin([cssPath, jsPath, fontPath], {}),
		new ExtractTextPlugin('./css/main.css'),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
	],
};
