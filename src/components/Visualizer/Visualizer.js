import React, {Component} from 'react';
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
   * todo: method name suggests that only objects are returned having at least one annotation
   *
   * @returns Promise for an array containing the fetched JSON objects
   */
  getAnnotatedObjects() {

    const db = firebase.database();

    return db.ref("Projects/17/Objects")
      .once('value')
      .then(snapshot => {

        return Object.values(snapshot.exportVal());
      });
  }

  onSelectObject(objectName) {

    this.setState({
      showWindow: false
    });

    if (objectName) {

      this.getAnnotatedObjects().then(objects => {

        const object = objects.find(obj => obj.ID === objectName);

        if (object === null || !object.Status) {

          return;
        }

        this.setState({
          showWindow: true,
          objectData: object,
          camera: {
            pX: object.Status.CameraPosition.x,
            pY: object.Status.CameraPosition.y,
            pZ: object.Status.CameraPosition.z,
            rX: object.Status.CameraRotation.x,
            rY: object.Status.CameraRotation.y,
            rZ: object.Status.CameraRotation.z,
          }
        });
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
        <Scene modelLocation={this.modelLocation} newObject={this.state.newObject} defects={this.state.defects}
               camera={this.state.camera} onSelectObject={this.onSelectObject}/>
      </div>
    );
  }
}

export default Visualizer;
