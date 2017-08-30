console.time('start up time')
const React =  require("react")
const { AppRegistry } =  require("react-native")

const App = require("./app").default

AppRegistry.registerComponent("examples", () => App);
console.timeEnd('start up time')
