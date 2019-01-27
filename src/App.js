
import React, { Component } from "react";
import Visualizer from "./components/Visualizer/Visualizer";
import firebase from "./components/Firebase/Firebase.js";
import { Table, TableHead, TableBody, TableRow, TableCell, TableFooter, Card, CardContent, Typography, Button } from "@material-ui/core";

class App extends Component {

  constructor(props) {

    super(props);

    this.state = {
      objects: []
    };

    this._visualizer = null;
  }

  componentDidMount() {

    // use private method to populate mock table
    this._visualizer._getAnnotatedObjects().then(objects => {

      this.setState({
        objects: objects
      });
    });
  }

  render() {

    return (
      <div style={{ width: '1000px', margin: '1em auto' }}>
        <div className="container">
            <div style={{ margin: '14px' }}>
              <Visualizer ref={element => { this._visualizer = element; }} database={firebase.database()} />
            </div>
            <div style={{ margin: '14px' }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" id="tableTitle">
                    Table of objects
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Object ID</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        this.state.objects.map((data, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell component="th" scope="row">{data.ID}</TableCell>
                              <TableCell>{data.Category}</TableCell>
                              <TableCell>{data.Name}</TableCell>
                              <TableCell align="right">
                                <Button onClick={() => { this._visualizer.selectObject(data.ID); }} variant="contained" size="small" color="primary">Show</Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      }
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell>{this.state.objects.length} entries</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
      </div>
    );
  }
}

export default App;
