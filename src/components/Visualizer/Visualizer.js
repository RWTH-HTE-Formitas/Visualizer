import React, { Component } from 'react';
import Scene from "./Scene";
import FloatingWindow from "../FloatingWindow/FloatingWindow";
import firebase from '../Firebase/Firebase.js';

class Visualizer extends Component {

    constructor(props) {

        super(props);

        this.modelLocation = "https://raw.githubusercontent.com/RWTH-HTE-Formitas/Visualizer/tmp/sample.gltf";
        this.onSelectObject = this.onSelectObject.bind(this);

        this.state = {
          showWindow: false,
          objectData: {}
        };
    }


    /**
     * Queries all objects that have notes attached to them from Firebase.
     *
     * @returns an array containing the fetched JSON objects
     */
    getAnnotatedObjects() {

        var db = firebase.database();
        var jsonResults = [];
        var objectsRef = db.ref("Projects/17/Objects");

        objectsRef.on("value", snapshot => {

            snapshot.forEach(childSnapshot => {

                jsonResults.push(childSnapshot.val());
            });
        });

        return jsonResults;
    }


    onSelectObject(objectName) {

        if (objectName) {

            // create Array with all objects that have notes attached (in sample firebase: 3 ojects)
            const jsonResults = this.getAnnotatedObjects();
            if (!jsonResults.length) {

                return;
            }

            const oData = jsonResults.find(x=> x.ID === objectName);
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

        else {

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

    markDefects(data) {

        this.setState({
            defects: data
        });
    }

    render() {

        return (
            <div>
                <FloatingWindow data={this.state}/>
                <Scene modelLocation={this.modelLocation} newObject={this.state.newObject} defects={this.state.defects} camera={this.state.camera} onSelectObject={this.onSelectObject} />
            </div>
        );
    }
}

export default Visualizer;
