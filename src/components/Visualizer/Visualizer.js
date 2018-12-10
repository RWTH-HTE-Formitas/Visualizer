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
                if(childSnapshot.hasChild('Notes')){
                    jsonResults.push(childSnapshot.val());
                }
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

    fetch_object_data(id){
        // create Array with all objects that have notes attached (in sample firebase: 3 ojects)
        var jsonResults = this.getAnnotatedObjects();
        if (!jsonResults.length) {
            return;
        }
        
        var max = jsonResults.length;
        var i = Math.floor(Math.random() * (max-0) + 0);
        var oData = jsonResults[i];

        this.setState({
            showWindow: true,
            objectData: oData
        });

    }

    render() {
        return (
            <div>
                <FloatingWindow data={this.state}/>
                <Scene modelLocation={this.modelLocation} callBack={this.callBackObject} />
            </div>
        );
    }
}

export default Visualizer;
