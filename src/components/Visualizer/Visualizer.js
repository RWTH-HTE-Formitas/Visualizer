
import React, {Component} from "react";
import Scene from "./Scene";
import FloatingWindow from "../FloatingWindow/FloatingWindow";

/**
 * This is a managing component coordinating the communication with the data-source and the visualization components.
 */
class Visualizer extends Component {

  constructor(props) {

    super(props);

    this.state = {
      showWindow: false,
      objectData: {},
      selectedObjectName: null
    };

    this._scene = null;
  }

  /**
   * Selects the object with the given name.
   *
   * @param objectName
   */
  selectObject(objectName) {

    this.unSelectObject();

    // highlight object as being selected
    this._scene.updateObjectAppearance(objectName, {
      emissive: 0xffff00,
      // opacity: 0.3 // todo: make configurable
    });
    this.setState({
      selectedObjectName: objectName
    });

    // fetch and display annotations
    this._getAnnotatedObjects().then(objects => {

      const annotatedObject = objects.find(obj => obj.ID === objectName);

      // object does not have annotations to show
      if (!annotatedObject) {

        return;
      }

      // move camera to object
      const position = annotatedObject.Status.CameraPosition;
      const rotation = annotatedObject.Status.CameraRotation;
      const direction = {
        x: rotation.x - position.x,
        y: rotation.y - position.y,
        z: rotation.z - position.z
      };
      this._scene.navigateCameraTo(position, direction, true);

      // show details
      this.setState({
        showWindow: true,
        objectData: annotatedObject
      });
    });
  }

  /**
   * Un-selects any currently selected object.
   */
  unSelectObject() {

    if (this.state.selectedObjectName) {

      // remove visual highlighting
      this._scene.resetObjectAppearance(this.state.selectedObjectName);

      this.setState({
        selectedObjectName: null,
        showWindow: false
      });
    }
  }

  /**
   * Callback for Scene component that gets called when the user clicks on anything in the scene.
   *
   * @param objectName
   */
  onClickObject(objectName) {

    this.setState({
      showWindow: false
    });

    if (objectName) {

      this.selectObject(objectName);
    }

    else {

      this.unSelectObject();
    }
  }

  componentDidMount() {

    // mark objects having defect note
    this._getAnnotatedObjects().then(objects => {

      objects.forEach(object => {

        this._scene.updateObjectAppearance(object.ID, {
          emissive: 0xff0000
        }, true);
      });
    });
  }

  render() {

    return (
      <div>
        <FloatingWindow data={this.state}/>
        <Scene ref={element => { this._scene = element; }}
          url="https://raw.githubusercontent.com/RWTH-HTE-Formitas/Visualizer/tmp/sample.gltf"
          width="1000"
          height="400"
          onClickObject={objectName => { this.onClickObject(objectName); }}
        />
      </div>
    );
  }

  /**
   * Queries all objects that have notes attached to them from Firebase.
   *
   * @private
   * @returns Promise for an array containing the fetched JSON objects
   */
  _getAnnotatedObjects() {

    return this.props.database.ref("Projects/17/Objects")
      .once("value")
      .then(snapshot => {

        return Object.values(snapshot.exportVal());
      });
  }
}

export default Visualizer;
