
import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Moment from 'react-moment';

function TabContainer({children}) {

  return (
    <Typography component="div" style={{padding: 3 * 2}}>
      {children}
    </Typography>
  );
}

class InfoWindow extends React.Component {

  state = {
    value: 0,
  };

  handleChange = (event, value) => {

    this.setState({value});
  };

  handleChangeIndex = index => {

    this.setState({value: index});
  };

  showImage(url) {

    // todo: display image in large
  }

  render() {

    const inpData = this.props.data.objectData;

    let textNotes = [];
    let audioNotes = [];
    let imageNotes = [];

    if (inpData != null && inpData.Notes != null) {

      Object.values(inpData.Notes).map((note, i) => {

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

          textNotes = textNotes.concat(Object.values(note.TextNotes));
        }

        if (note.AudioNotes != null) {

          audioNotes = audioNotes.concat(Object.values(note.AudioNotes));
        }

        if (note.ImageNotes != null) {

          imageNotes = imageNotes.concat(Object.values(note.ImageNotes));
        }
      });
    }

    return (
      <div>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
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
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer>
            <table className="table table-text">
              <tbody>
              {
                Object.keys(inpData ? inpData : {}).map((k, i) => {

                  const val = inpData[k];

                  if (typeof (val) == 'string') {

                    return (
                      <tr key={i}>
                        <td>{k}:</td>
                        <td>{val}</td>
                      </tr>
                    );
                  }
                })
              }
              </tbody>
            </table>
          </TabContainer>
          <TabContainer>
            <table className="table table-text">
              <tbody>
              {
                textNotes.map((data, i) => {

                  const dateRaw = new Date(data.Date * 1000);

                  return (
                    <tr key={i}>
                      <td className="text">
                        {this.state.text0}
                      </td>
                      <td className="date">
                        <span><Moment format="MMM DD, YYYY">{dateRaw}</Moment></span>
                        <b> <Moment format="HH:mm">{dateRaw}</Moment></b>
                      </td>
                    </tr>
                  );
                })
              }
              </tbody>
            </table>
          </TabContainer>
          <TabContainer>
            <table className="table table-picture">
              <tbody>
              {
                imageNotes.map((data, i) => {

                  //const link = data.URL;
                  const dateRaw = new Date(data.Date * 1000);

                  // override
                  const link = 'https://raw.githubusercontent.com/RWTH-HTE-Formitas/Visualizer/tmp/sample.jpg';

                  return (
                    <tr key={i}>
                      <td className="text">
                        <a href="#" onClick={e => this.showImage(link)}>
                          <img src={link} style={{maxWidth: 100}} />
                        </a>
                      </td>
                      <td className="date">
                        <span><Moment format="MMM DD, YYYY">{dateRaw}</Moment></span>
                        <b> <Moment format="HH:mm">{dateRaw}</Moment></b>
                      </td>
                    </tr>
                  );
                })
              }
              </tbody>
            </table>
          </TabContainer>
          <TabContainer>
            <table className="table table-audio">
              <tbody>
              {
                audioNotes.map((data, i) => {

                  const dateRaw = new Date(data.Date * 1000);

                  return (
                    <tr key={i}>
                      <td className="text">
                        <audio controls>
                          <source src="https://raw.githubusercontent.com/RWTH-HTE-Formitas/Visualizer/tmp/sample.mp3"
                                  type="audio/mpeg"/>
                          Your browser does not support the audio element.
                        </audio>
                      </td>
                      <td className="date">
                        <span><Moment format="MMM DD, YYYY">{dateRaw}</Moment></span>
                        <b> <Moment format="HH:mm">{dateRaw}</Moment></b>
                      </td>
                    </tr>
                  );
                })
              }
              </tbody>
            </table>
          </TabContainer>
        </SwipeableViews>
      </div>
    );
  }
}

export default (InfoWindow);
