
import React, { Component } from "react";
import Visualizer from "./components/Visualizer/Visualizer";
import firebase from "./components/Firebase/Firebase.js";
import Moment from 'react-moment';
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
      <div style={{ width: '1200px', margin: '1em auto' }}>
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
                        <TableCell><Typography variant="body1">Object ID</Typography></TableCell>
                        <TableCell><Typography variant="body1">Category</Typography></TableCell>
                        <TableCell><Typography variant="body1">Name</Typography></TableCell>
                        <TableCell><Typography variant="body1">Last Change</Typography></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        this.state.objects.map((data, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell component="th" scope="row"><Typography variant="body1">{data.ID}</Typography></TableCell>
                              <TableCell><Typography variant="body1">{data.Category}</Typography></TableCell>
                              <TableCell><Typography variant="body1">{data.Name}</Typography></TableCell>
                              <TableCell>
                                <Typography variant="body1">
                                  <Moment format="MMM DD, YYYY">{new Date(data.Status.Timestamp * 1000)}</Moment>
                                  <b> <Moment format="HH:mm">{new Date(data.Status.Timestamp * 1000)}</Moment></b>
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Button onClick={() => { this._visualizer.selectObject(data.ID); window.scrollTo(0, 0); }} variant="contained" size="small" color="primary">Show</Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      }
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell><Typography variant="body1">{this.state.objects.length} entries</Typography></TableCell>
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
