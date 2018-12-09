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


    state = {
        showWindow: false,
        objectData: {}
    };

    callBackObject(data) {
        if (data) {
            this.fetch_object_data(data);
        }
    }

    fetch_object_data(id){
        fetch(API + DEFAULT_QUERY)
        .then(response => response.json())
        .then(data => {
            
            var max = Object.values(data.Objects).length -1
            var i = Math.floor(Math.random() * (max-0) + 0);
            var ss = Object.values(data.Objects)[i];

            this.setState({
                showWindow: true,
                objectData: ss
            });
        });
    }

    render() {
        return (
            <div style={styles}>
                <FloatingWindow data={this.state}/>
                <Scene modelLocation={this.modelLocation} callBack={this.callBackObject} />
            </div>
        );
    }
}

export default Visualizer;
