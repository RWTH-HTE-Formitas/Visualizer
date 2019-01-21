import React, {Component} from "react";
import Scene from "./Scene";
import FloatingWindow from "../FloatingWindow/FloatingWindow";
import firebase from "../Firebase/Firebase.js";

class Visualizer extends Component {

  constructor(props) {

    super(props);

    this.modelLocation = "https://raw.githubusercontent.com/RWTH-HTE-Formitas/Visualizer/tmp/sample.gltf";

    this.state = {
      showWindow: false,
      objectData: {}
    };

    this._scene = null;
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
      .once("value")
      .then(snapshot => {

        return Object.values(snapshot.exportVal());
      });
  }

  onClickObject(objectName) {

    this.setState({
      showWindow: false
    });

    if (objectName) {

      this.getAnnotatedObjects().then(objects => {

        const object = objects.find(obj => obj.ID === objectName);

        if (!object || !object.Status) {

          return;
        }

        this.highlightObject(object);
      });
    }
  }

  highlightObject(object) {

    if (!object || !object.Status) {

      this.setState({
        showWindow: false
      });

      return;
    }

    const position = object.Status.CameraPosition;
    const rotation = object.Status.CameraRotation;
    const direction = {
      x: rotation.x - position.x,
      y: rotation.y - position.y,
      z: rotation.z - position.z
    };

    this._scene.selectObject(object.ID);
    this._scene.navigateCameraTo(position,direction, true);

    this.setState({
      showWindow: true,
      objectData: object
    });

  }

  markDefects(data) {

    data.forEach(element => {

      this._scene.updateObjectAppearance(element.ID, {
        emissive: 0xff0000
      });
    });
  }

  render() {

    return (
      <div>
        <FloatingWindow data={this.state}/>
        <Scene ref={element => { this._scene = element; }} modelLocation={this.modelLocation}
               onClickObject={objectName => { this.onClickObject(objectName); }}/>
      </div>
    );
  }
}

export default Visualizer;
