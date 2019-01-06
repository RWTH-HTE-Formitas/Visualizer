import React, { Component } from 'react';
import Visualizer from './components/Visualizer/Visualizer';
import firebase from './components/Firebase/Firebase.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.getObjects();
  }

  getObjects() {
    var db = firebase.database();
    var jsonResults = [];
    var self = this;
    // get all objects that have a note attached
    var objectsRef = db.ref("Projects/17/Objects");
    objectsRef.once("value").then((snapshot) => {
      snapshot.forEach(function (childSnapshot) {
        jsonResults.push(childSnapshot.val());
      });
      if (jsonResults.length > 0) {
        self.setState({
          objects: jsonResults
        })
      }
    });
  }

  state = {
    objects: [],
  };

  render() {
    return (
      <div style={{ width: '1000px', margin: '1em auto' }}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12" style={{ width: '100%' }}>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="#">Formitas</a></li>
                  <li className="breadcrumb-item"><a href="#">Project ABC</a></li>
                  <li className="breadcrumb-item active" aria-current="page">Defect Notes</li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <h1 style={{ margin: "1em 0 1em 0" }}>Project ABC - Defect Notes</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <Visualizer ref={(element) => { this._visualizer = element; }} />
            </div>
          </div>
          <div className="row" style={{ margin: "2em 0" }}>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.objects.map((data, i) => {
                    return (
                      <tr key={i}>
                        <td>{data.ID}</td>
                        <td>{data.Name}</td>
                        <td className="text-right"><a href="#" className="pull-right" onClick={() => { this._visualizer.fetch_object_data({name: data.ID}); return false; }}>Show</a></td>
                      </tr>
                    );
                  })
                }
              </tbody>
              <tfoot>
                <tr>
                  <td className="text-muted">{this.state.objects.length} entries</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
