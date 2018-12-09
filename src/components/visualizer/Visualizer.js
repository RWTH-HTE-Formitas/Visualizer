import React, { Component } from 'react';
import Scene from "./Scene";
import FloatingWindow from "../FloatingWindow/FloatingWindow";
import firebase from '../Firebase/Firebase.js';

const styles = {
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
};

const API = 'https://raw.githubusercontent.com/RWTH-HTE-Formitas/Visualizer/tmp/';
var DEFAULT_QUERY;

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
        }
    }

    fetch_object_data(id){
        // create Array with all objects that have notes attached (in sample firebase: 3 ojects)
        var jsonResults = this.getAnnotatedObjects();
        /*for(let i = 0; i < jsonResults.length; i++){
            var t = jsonResults[i];
            console.log(t['ID']);
        }*/
        
        var max = jsonResults.length;
        var i = Math.floor(Math.random() * (max-0) + 0);
        var oData = jsonResults[i];

        this.setState({
            showWindow: true,
            objectData: oData
        });

        /*fetch(API + DEFAULT_QUERY)
        .then(response => response)
        .then(data => {
            
            // choosing which object to show randomly. 
            // TODO: choose the right object to show
            var max = Object.values(data.Objects).length -1
            var i = Math.floor(Math.random() * (max-0) + 0);
            
            var ss = Object.values(data.Objects)[i];

            this.setState({
                showWindow: true,
                objectData: ss
            });
        });*/
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
