'use strict';

var React = require('react-native');
var {
  WebView
} = React;

var Canvas = React.createClass({

  propTypes: {
    render: React.PropTypes.func.isRequired
  },

  render() {

    var contextString = JSON.stringify(this.props.context);
    var renderString = this.props.render.toString();

    return (
      <WebView
        automaticallyAdjustContentInsets={false}
        contentInset={{top: 0, right: 0, bottom: 0, left: 0}}
        html={"<style>*{margin:0;padding:0;}canvas{position:absolute;transform:translateZ(0);}</style><canvas></canvas><script>var canvas = document.querySelector('canvas');(" + renderString + ").bind(" + contextString + ")(canvas);</script>"}
        opaque={false}
        underlayColor={'transparent'}
        style={this.props.style}
      />
    );
  }
});

module.exports = Canvas;
