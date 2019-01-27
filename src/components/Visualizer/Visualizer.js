
import React, {Component} from "react";
import Scene from "./Scene";
import InfoWindow from "../InfoWindow/InfoWindow";
import { Card, CardContent } from "@material-ui/core";

/**
 * This is a managing component coordinating the communication with the data-source and the visualization components.
 *
 * Properties:
 *
 * - database : Firebase database that the annotation data is loaded from
 */
class Visualizer extends Component {

  constructor(props) {

    super(props);

    this.state = {
      showWindow: false,
      selectedObjectName: null,
      selectedAnnotatedObject: null,
      transparentObjectNames: []
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

    this.setState({
      selectedObjectName: objectName,
      selectedAnnotatedObject: null
    });

    this._updateObjectAppearance(objectName);

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
        selectedAnnotatedObject: annotatedObject
      });
    });
  }

  /**
   * Un-selects any currently selected object.
   */
  unSelectObject() {

    if (this.state.selectedObjectName) {

      const objectName = this.state.selectedObjectName;

      this.setState({
        selectedObjectName: null,
        selectedAnnotatedObject: null,
        showWindow: false
      });

      this._updateObjectAppearance(objectName);
    }
  }

  /**
   * Makes the object with the given name transparent.
   *
   * @param objectName
   */
  makeObjectTransparent(objectName) {

    const transparentObjectNames = [...this.state.transparentObjectNames];
    const index = transparentObjectNames.indexOf(objectName);

    if (index === -1) {

      this.setState({
        transparentObjectNames: [...this.state.transparentObjectNames, objectName]
      });

      this._updateObjectAppearance(objectName);
    }
  }

  /**
   * Makes the object with the given name solid.
   *
   * @param objectName
   */
  makeObjectSolid(objectName) {

    const transparentObjectNames = [...this.state.transparentObjectNames];
    const index = transparentObjectNames.indexOf(objectName);

    if (index !== -1) {

      transparentObjectNames.splice(index, 1);

      this.setState({
        transparentObjectNames: transparentObjectNames
      });

      this._updateObjectAppearance(objectName);
    }
  }

  /**
   * Tests whether the object with the given name is transparent.
   *
   * @param objectName
   * @returns {boolean}
   */
  isObjectTransparent(objectName) {

    return this.state.transparentObjectNames.indexOf(objectName) !== -1;
  }

  onLoad() {

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
        <Card>
          <CardContent style={{padding: "0"}}>
            <Scene ref={element => { this._scene = element; }}
              url="https://raw.githubusercontent.com/RWTH-HTE-Formitas/Visualizer/tmp/sample.gltf"
              width="1200"
              height="600"
              onLoad={() => this.onLoad()}
              onClickObject={objectName => { this.onClickObject(objectName); }}
              onRightClickObject={objectName => { this._onRightClickObject(objectName); }}
            />
            <InfoWindow selectedAnnotatedObject={this.state.selectedAnnotatedObject} />
          </CardContent>
        </Card>
      </div>
    );
  }

  _updateObjectAppearance(objectName) {

    const settings = this._scene.getOriginalObjectAppearance(objectName);

    if (this.state.selectedObjectName === objectName) {

      settings.emissive = 0xffff00;
    }

    if (this.isObjectTransparent(objectName)) {

      settings.opacity = .3;
    }

    this._scene.updateObjectAppearance(objectName, settings);
  }

  /**
   * Callback for Scene component that gets called when the user clicks on anything in the scene.
   *
   * @param objectName
   */
  _onClickObject(objectName) {

    if (objectName) {

      this.selectObject(objectName);
    }

    else {

      this.unSelectObject();
    }
  }

  _onRightClickObject(objectName) {

    if (objectName) {

      // Toggle object transparency.

      if (this.isObjectTransparent(objectName)) {

        this.makeObjectSolid(objectName);
      }
      else {

        this.makeObjectTransparent(objectName);
      }
    }
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
