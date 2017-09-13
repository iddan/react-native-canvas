const React = require('react');
const {AppRegistry} = require('react-native');

const App = require('./app').default;

AppRegistry.registerComponent('examples', () => App);
