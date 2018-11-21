import React, { Component } from 'react';
import Scene from "./Scene";
import FloatingWindow from "../window/Window";

const styles = {
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
};

class Visualizer extends Component {

    modelLocation = "https://raw.githubusercontent.com/RWTH-HTE-Formitas/Visualizer/tmp/public/model.gltf";

    dt = {
        name: 'Horizontal Pipe 101',
        annotation: 'Direction is not quite right'
    }

    render() {
        return (
            <div style={styles}>
                <Scene modelLocation={this.modelLocation} />
                <FloatingWindow data={this.dt}/>
            </div>
        );
    }
}

export default Visualizer;
