import React, { Component } from "react"
import { Image, ScrollView, StatusBar, Text, View } from "react-native"

import Canvas from "react-native-canvas"

class App extends Component {
    handlePurpleRect(canvas) {
        canvas.width = 100
        canvas.height = 100

        const context = canvas.getContext("2d")

        context.fillStyle = "purple"
        context.fillRect(0, 0, 100, 100)
    }

    handleRedCircle(canvas) {
        canvas.width = 100
        canvas.height = 100

        const context = canvas.getContext("2d")

        context.arc(50, 50, 49, 0, Math.PI * 2, true)

        context.fillStyle = "red"
        context.fill()
    }

    async handleBase64Image(canvas) {
        const data = "data:image/png;base64,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"

        canvas.width = 188
        canvas.height = 51

        const context = canvas.getContext("2d")

        context.drawImage(data, 0, 0, 188, 51)

        // const rendered = await canvas.toDataURL()
        // console.log("rendered base64", rendered)
    }

    handleHrefImage(canvas) {
      canvas.width = 100
      canvas.height = 100

      const context = canvas.getContext("2d")

      context.drawImage("https://facebook.github.io/react/img/logo.svg", 0, 0, 100, 100)

      // const rendered = await canvas.toDataURL()
      // console.log("rendered base64", rendered)
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />
                <ScrollView style={styles.examples}>
                    <View style={styles.example}>
                        <View style={styles.exampleLeft}>
                          <Text>Example</Text>
                        </View>
                        <View style={styles.exampleRight}>
                          <Text>Sample</Text>
                        </View>
                    </View>
                    <View style={styles.example}>
                        <View style={styles.exampleLeft}>
                          <Canvas ref={ref => this.handlePurpleRect(ref)} />
                        </View>
                        <View style={styles.exampleRight}>
                          <Image source={require("./images/purple-rect.png")} />
                        </View>
                    </View>
                    <View style={styles.example}>
                        <View style={styles.exampleLeft}>
                          <Canvas ref={ref => this.handleRedCircle(ref)} />
                        </View>
                        <View style={styles.exampleRight}>
                          <Image source={require("./images/red-circle.png")} />
                        </View>
                    </View>
                    <View style={styles.example}>
                        <View style={styles.exampleLeft}>
                          <Canvas ref={ref => this.handleBase64Image(ref)} />
                        </View>
                        <View style={styles.exampleRight}>
                          <Image source={require("./images/over.png")} />
                        </View>
                    </View>
                    <View style={styles.example}>
                        <View style={styles.exampleLeft}>
                          <Canvas ref={ref => this.handleHrefImage(ref)} />
                        </View>
                        <View style={styles.exampleRight}>
                          <Image style={{width: 100, height: 100}} source={require("./images/react.png")} />
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const full = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
}

const cell = {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
}

const styles = {
    container: {
        ...full,
    },
    examples: {
        ...full,
        padding: 5,
        paddingBottom: 0,
    },
    example: {
        paddingBottom: 5,
        flex: 1,
        flexDirection: "row",
    },
    exampleLeft: {
        ...cell,
    },
    exampleRight: {
        ...cell,
    },
}

export default App
