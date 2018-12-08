import React, { Component } from 'react';
import Scene from "./Scene";
import FloatingWindow from "../FloatingWindow/FloatingWindow";

const styles = {
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
};

const API = 'https://raw.githubusercontent.com/RWTH-HTE-Formitas/Visualizer/tmp/';
const DEFAULT_QUERY = 'sample.json';

class Visualizer extends Component {

    constructor(props) {
        super(props);
        this.callBackObject = this.callBackObject.bind(this);
    }

    modelLocation = "https://raw.githubusercontent.com/RWTH-HTE-Formitas/Visualizer/tmp/public/model.gltf";

    state = {};

    callBackObject(data) {
        this.setState(data);
    }

    componentDidMount() {
        fetch(API + DEFAULT_QUERY)
        .then(response => response.json())
        .then(data => {
            var ss = Object.values(data.Objects)[1];
            this.setState(ss);
        });
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
