
import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import Typography from '@material-ui/core/Typography';
import Moment from 'react-moment';
import { AppBar, Tabs, Tab, Button } from '@material-ui/core';
import { Table, TableRow, TableCell, TableBody } from '@material-ui/core';
import ReactModal from 'react-modal';
import './InfoWindow.scss'

function TabContainer({children}) {

  return (
    <Typography component="div" style={{padding: 3 * 2}}>
      {children}
    </Typography>
  );
}

class InfoWindow extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      activeTab: 0,
      showModal: false
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.showImage = this.showImage.bind(this);
  }

  detail = null;

  onChangeTab(newTab) {

    this.setState({
      activeTab: newTab
    });
  };

  showImage(url) {
    this.detail = <img src={url} alt="" />;
    this.handleOpenModal();
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  componentWillReceiveProps(nextProps) {
    // set active tab to 0 again if new data comes
    this.setState({
      activeTab: 0
    });
  }

  render() {

    const object = this.props.selectedAnnotatedObject;

    let textNotes = [];
    let audioNotes = [];
    let imageNotes = [];

    if (object != null && object.Notes != null) {

      Object.values(object.Notes).forEach((note, i) => {

        if (note.TextNotes != null) {

          var link = 'https://raw.githubusercontent.com/RWTH-HTE-Formitas/Visualizer/tmp/sample.txt';

          fetch(link).then(response => {

            response.text().then(text => {

              if (i === 0) {

                this.setState({text0: text})
              }
              else if (i === 1) {

                this.setState({text1: text})
              }
            })
          });
          Object.values(note.TextNotes).forEach(
            (data) => {
              const obj = data;
              obj.email = note.Email;
              textNotes.push(obj);
            }
          );
        }

        if (note.AudioNotes != null) {
          Object.values(note.AudioNotes).forEach(
            (data) => {
              const obj = data;
              obj.email = note.Email;
              audioNotes.push(obj);
            }
          );
        }

        if (note.ImageNotes != null) {
          Object.values(note.ImageNotes).forEach(
            (data) => {
              const obj = data;
              obj.email = note.Email;
              imageNotes.push(obj);
            }
          );
        }
      });
    }

    return (
      <div style={ object ? {} : { display: 'none'} }>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.activeTab}
            onChange={(_, index) => this.onChangeTab(index)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Info"/>
            <Tab label="Text"/>
            <Tab label="Picture"/>
            <Tab label="Voice"/>
          </Tabs>
        </AppBar>
        <SwipeableViews
          index={this.state.activeTab}
          onChangeIndex={(index) => this.onChangeTab(index)}
        >
          <TabContainer>
          <Table>
            <TableBody>
              {
                Object.keys(object ? object : {}).map((k, i) => {

                  const val = object[k];

                  if (typeof (val) == 'string') {
                    return (
                      <TableRow key={i}>
                        <TableCell component="th" scope="row" align="right"><Typography variant="body1">{k}:</Typography></TableCell>
                        <TableCell><Typography variant="body1">{val}</Typography></TableCell>
                      </TableRow>
                    );
                  }
                  else {
                    return (null);
                  }
                })
              }
            </TableBody>
          </Table>
          </TabContainer>
          <TabContainer>
            <Table>
              <TableBody>
              {
                textNotes.map((data, i) => {

                  const dateRaw = new Date(data.Date * 1000);

                  return (
                    <TableRow key={i}>
                      <TableCell className="text">
                        <Typography variant="body1">{this.state.text0}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{data.email}</Typography>
                      </TableCell>
                      <TableCell className="date">
                        <Typography variant="body1">
                          <Moment format="MMM DD, YYYY">{dateRaw}</Moment>
                          <b> <Moment format="HH:mm">{dateRaw}</Moment></b>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              }
              </TableBody>
            </Table>
          </TabContainer>
          <TabContainer>
            <Table>
              <TableBody>
              {
                imageNotes.map((data, i) => {

                  //const link = data.URL;
                  const dateRaw = new Date(data.Date * 1000);

                  // override
                  const link = 'https://raw.githubusercontent.com/RWTH-HTE-Formitas/Visualizer/tmp/sample.jpg';

                  return (
                    <TableRow key={i}>
                      <TableCell className="text">
                        <img src={link} style={{maxWidth: 100}}  onClick={() => this.showImage(link)} alt=""/>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{data.email}</Typography>
                      </TableCell>
                      <TableCell className="date">
                        <Typography variant="body1">
                          <Moment format="MMM DD, YYYY">{dateRaw}</Moment>
                          <b> <Moment format="HH:mm">{dateRaw}</Moment></b>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              }
              </TableBody>
            </Table>
          </TabContainer>
          <TabContainer>
            <Table>
              <TableBody>
              {
                audioNotes.map((data, i) => {

                  const dateRaw = new Date(data.Date * 1000);

                  return (
                    <TableRow key={i}>
                      <TableCell className="text">
                        <audio controls>
                          <source src="https://raw.githubusercontent.com/RWTH-HTE-Formitas/Visualizer/tmp/sample.mp3"
                                  type="audio/mpeg"/>
                          Your browser does not support the audio element.
                        </audio>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{data.email}</Typography>
                      </TableCell>
                      <TableCell className="date">
                        <Typography variant="body1">
                          <Moment format="MMM DD, YYYY">{dateRaw}</Moment>
                          <b> <Moment format="HH:mm">{dateRaw}</Moment></b>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              }
              </TableBody>
            </Table>
          </TabContainer>
        </SwipeableViews>
        <ReactModal
          isOpen={this.state.showModal}
          contentLabel="onRequestClose Example"
          onRequestClose={this.handleCloseModal}
          className="Modal"
          overlayClassName="Overlay"
        >
          <div className="header">
              <Button onClick={this.handleCloseModal} variant="contained" size="small" color="secondary">X</Button>
          </div>
          <div className="body frame">
              <span className="helper"></span>
              {this.detail}
          </div>
        </ReactModal>
      </div>
    );
  }
}

export default (InfoWindow);
