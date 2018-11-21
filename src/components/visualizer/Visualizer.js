import React, { Component } from 'react';
import Scene from "./Scene";
import FloatingWindow from "../FloatingWindow/FloatingWindow";

const styles = {
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
};

class Visualizer extends Component {

    constructor(props) {
        super(props);
        this.callBackObject = this.callBackObject.bind(this);
    }

    modelLocation = "https://raw.githubusercontent.com/RWTH-HTE-Formitas/Visualizer/tmp/public/model.gltf";

    state = {
        name: '',
        annotation: ''
    };

    callBackObject(data) {
        this.setState(data);
    }

    render() {
        return (
            <div style={styles}>
                <Scene modelLocation={this.modelLocation} callBack={this.callBackObject} />
                <FloatingWindow data={this.state}/>
            </div>
        );
    }
}

export default Visualizer;
