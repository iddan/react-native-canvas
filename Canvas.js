import React from 'react'
import { View, WebView } from 'react-native'

const Canvas = ({ context, render, style }) => {
  const contextString = JSON.stringify(context)
  const renderString = render.toString()
  const jsCode = `var canvas = document.querySelector("canvas");(${renderString}).call(${contextString}, canvas)`

  return (
    <View>
      <WebView
        automaticallyAdjustContentInsets={false}
        contentInset={{top: 0, right: 0, bottom: 0, left: 0}}
        source={{html: '<style>*{margin:0;padding:0}canvas{transform:translateZ(0)}</style><canvas></canvas>'}}
        injectedJavaScript={jsCode}
        style={style} />
    </View>
  )
}

export default Canvas
