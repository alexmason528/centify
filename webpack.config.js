const NODE_ENV = process.env.NODE_ENV;
const dotenv = require('dotenv');

const webpack = require('webpack');
const fs      = require('fs');
const path    = require('path'),
      join    = path.join,
      resolve = path.resolve;

const getConfig = require('hjs-webpack');

const isDev   = (NODE_ENV === 'localdev');
const isTest  = NODE_ENV === 'test';

const root    = resolve(__dirname);
const src     = join(root, 'src');
const modules = join(root, 'node_modules');
const dest    = join(root, 'dist');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

var config = getConfig({
  isDev: isDev,
  in: join(src, 'app.js'),
  out: dest,
  html: function (context) {
    var assets = context.stats.assetsByChunkName.main;
    var main_css = '';
    for(var i = 0; i < assets.length; i++) {
      if (assets[i].search('.css') >= 0 && assets[i].search('awesome') < 0) {
        main_css = assets[i];
        break;
      }
    }
    return {
      'index.html': context.defaultTemplate({
        title: 'MyCentify',
        publicPath: isDev ? 'http://localhost:3000/' : '',
        meta: {
          'name': 'MyCentify',
          'description': 'MyCentify'
        },
        css: main_css,
        head: '<link rel="icon" href="/images/favicon-32x32.png" sizes="32x32" /><link rel="icon" href="/images/favicon-192x192.png" sizes="192x192" />',
      })
    }
  }
});

// ENV variables
const dotEnvVars = dotenv.config();
const environmentEnv = dotenv.config({
  path: join(root, 'config', `${NODE_ENV}.config.env`),
  silent: true,
});
const envVariables =
    Object.assign({}, dotEnvVars, environmentEnv);

const defines =
  Object.keys(envVariables)
  .reduce((memo, key) => {
    const val = JSON.stringify(envVariables[key]);
    memo[`__${key.toUpperCase()}__`] = val;
    return memo;
  }, {
    __NODE_ENV__: JSON.stringify(NODE_ENV)
  });

config.plugins = [
  new webpack.DefinePlugin(defines),
  new ExtractTextPlugin('font-awesome.css'),
  new CopyWebpackPlugin([ { from: 'assets' } ])
].concat(config.plugins);
// END ENV variables

// CSS modules
const cssModulesNames = `${isDev ? '[path][name]__[local]__' : ''}[hash:base64:5]`;

const matchCssLoaders = /(^|!)(css-loader)($|!)/;

const findLoader = (loaders, match) => {
  const found = loaders.filter(l => l && l.loader && l.loader.match(match))
  return found ? found[0] : null;
}
// existing css loader
const cssloader =
  findLoader(config.module.loaders, matchCssLoaders);

const newloader = Object.assign({}, cssloader, {
  test: /\.module\.css$/,
  include: [src],
  loader: cssloader.loader.replace(matchCssLoaders, `$1$2?modules&localIdentName=${cssModulesNames}$3`)
})
config.module.loaders.push(newloader);
cssloader.test = new RegExp(`^(?!.*(module|bootstrap)).*${cssloader.test.source}`)
cssloader.loader = newloader.loader

config.module.loaders.push(
  {
    test: /(font-awesome\.css|design-system\.css|bootstrap\.css)$/,
    include: [modules],
    loader: 'style-loader!css-loader'
  },
  {
    test: /\.css$/,
    exclude: /(font-awesome\.css|design-system\.css|bootstrap\.css)$/,
    include: [modules],
    loader: 'style-loader!css-loader'
  },
  {
    test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?/,
    include: [modules],
    loader: 'url'
  },
  {
    test: /\.(eot|svg|ttf)(\?v=\d+\.\d+\.\d+)?/,
    loader: 'url'
  }
)

// Remove original font file loaders, this is kind of hack
config.module.loaders.splice(2, 5);

// postcss
config.postcss = [].concat([
  require('precss')({}),
  require('autoprefixer')({}),
  require('cssnano')({})
])
// END postcss

// Roots
config.resolve.root = [src, modules]
config.resolve.alias = {
  'css': join(src, 'styles'),
  'containers': join(src, 'containers'),
  'components': join(src, 'components'),
  'utils': join(src, 'utils'),

  'styles': join(src, 'styles')
}
// end Roots

// Testing
if (isTest) {
  config.externals = {
    'react/addons': true,
    'react/lib/ReactContext': true,
    'react/lib/ExecutionEnvironment': true,
  }
  config.module.noParse = /[/\\]sinon\.js/;
  config.resolve.alias['sinon'] = 'sinon/pkg/sinon';

  config.plugins = config.plugins.filter(p => {
    const name = p.constructor.toString();
    const fnName = name.match(/^function (.*)\((.*\))/)

    const idx = [
      'DedupePlugin',
      'UglifyJsPlugin'
    ].indexOf(fnName[1]);
    return idx < 0;
  })
}
// End Testing

module.exports = config;
