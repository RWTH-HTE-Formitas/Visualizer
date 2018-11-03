import React, { Component } from 'react';
import Scene from "./Scene";

const styles = {
    width: "100vw",
    height: "100vh"
};

class Visualizer extends Component {
    render() {
        return (
            <div style={styles}>
                <Scene />
                <div
                    style={{
                        zIndex: 1,
                        position: "absolute"
                    }}
                >
                </div>
            </div>
        );
    }
}

export default Visualizer;
