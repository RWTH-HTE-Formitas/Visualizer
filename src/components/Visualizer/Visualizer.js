import React, { Component } from 'react';
import Scene from "./Scene";
import FloatingWindow from "../FloatingWindow/FloatingWindow";
import firebase from '../Firebase/Firebase.js';

class Visualizer extends Component {

    constructor(props) {
        super(props);
        this.callBackObject = this.callBackObject.bind(this);
    }

    modelLocation = "https://raw.githubusercontent.com/RWTH-HTE-Formitas/Visualizer/tmp/sample.glb";


    state = {
        showWindow: false,
        objectData: {}
    };


    /* Queries all objects that have notes attached to them from Firebase
        returns: an array containing the fetched JSON objects 
    */
    getAnnotatedObjects(){
        var db = firebase.database();
        var jsonResults = [];
        // get all objects that have a note attached
        var objectsRef = db.ref("Projects/17/Objects");
        objectsRef.orderByKey().on("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                jsonResults.push(childSnapshot.val());
            });
        });
        return jsonResults;
    }


    callBackObject(data) {
        if (data) {
            this.fetch_object_data(data);
        } else {
            this.setState({
                showWindow: false
            });
        }
    }

    highlightObject(oData) {
        if (!oData || !oData.Status) {
            this.setState({
                showWindow: false
            });
            return;
        }
        this.setState({
            showWindow: true,
            objectData: oData,
            camera: {
                pX: oData.Status.CameraPosition.x,
                pY: oData.Status.CameraPosition.y,
                pZ: oData.Status.CameraPosition.z,
                rX: oData.Status.CameraRotation.x,
                rY: oData.Status.CameraRotation.y,
                rZ: oData.Status.CameraRotation.z,
            },
            newObject: oData
        });

    }

    fetch_object_data(data){
        // create Array with all objects that have notes attached (in sample firebase: 3 ojects)
        var jsonResults = this.getAnnotatedObjects();
        if (!jsonResults.length) {
            return;
        }

        var oData = jsonResults.find(x=> x.ID == data.name);
        if (!oData || !oData.Status) {
            this.setState({
                showWindow: false
            });
            return;
        }

        this.setState({
            showWindow: true,
            objectData: oData,
            camera: {
                pX: oData.Status.CameraPosition.x,
                pY: oData.Status.CameraPosition.y,
                pZ: oData.Status.CameraPosition.z,
                rX: oData.Status.CameraRotation.x,
                rY: oData.Status.CameraRotation.y,
                rZ: oData.Status.CameraRotation.z,
            }
        });

    }

    render() {
        return (
            <div>
                <FloatingWindow data={this.state}/>
                <Scene modelLocation={this.modelLocation} newObject={this.state.newObject} camera={this.state.camera} callBack={this.callBackObject} />
            </div>
        );
    }
}

export default Visualizer;