import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Moment from 'react-moment';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
  },
});

class InfoContent extends React.Component {

  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  showDetail(type, source) {

  }

  render() {
    const { classes, theme } = this.props;

    const showWindow = this.props.data.showWindow;
    const inpData = this.props.data.objectData;
    let textNotes = [];
    let audioNotes = [];
    let imageNotes = [];
    if (inpData != null && inpData.Notes != null) {
      Object.values(inpData.Notes).map((note, i) => {
        if (note.TextNotes != null) {
          textNotes = textNotes.concat(Object.values(note.TextNotes));
        }
        if (note.AudioNotes != null) {
          audioNotes = audioNotes.concat(Object.values(note.AudioNotes));
        }
        if (note.ImageNotes != null) {
          imageNotes = imageNotes.concat(Object.values(note.ImageNotes));
        }
      })
    }

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            <Tab label="Info" />
            <Tab label="Text" />
            <Tab label="Picture" />
            <Tab label="Voice" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer dir={theme.direction}>
            <table className="table-info">
              <tbody>
                {
                  Object.keys(inpData).map((k, i) => {
                    const val = inpData[k]
                    if (typeof (val) == 'string') {
                      return (
                        <tr key={i}>
                          <td>{k}: </td>
                          <td>{val}</td>
                        </tr>
                      );
                    }
                  })
                }
              </tbody>
            </table>
          </TabContainer>
          <TabContainer dir={theme.direction}><table className="table table-text">
            <tbody>
              {
                textNotes.map((data, i) => {
                  var item = data.URL.split('/').slice(-1)[0]
                  var link = data.URL;
                  var storedText;
                  link = 'https://raw.githubusercontent.com/RWTH-HTE-Formitas/Visualizer/tmp/sample.txt';
                  fetch(link).then(response => {response.text().then(text => {
                    storedText = text;
                    console.log(text)
                  })
                  })

                  var dateRaw = new Date(data.Date * 1000);
                  return (
                    <tr key={i}>
                      <td className="text">
                        {storedText}
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
          <TabContainer dir={theme.direction}><table className="table table-picture">
            <tbody>
              {
                imageNotes.map((data, i) => {
                  var link = data.URL
                  var dateRaw = new Date(data.Date * 1000)
                  // override
                  link = 'https://raw.githubusercontent.com/RWTH-HTE-Formitas/Visualizer/tmp/sample.jpg';
                  return (
                    <tr key={i}>
                      <td className="text">
                        <a href="#" onClick={e => this.showDetail('image', link)}>
                          <img src={link} />
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
          <TabContainer dir={theme.direction}><table className="table table-audio">
            <tbody>
              {
                audioNotes.map((data, i) => {
                  var item = data.URL.split('/').slice(-1)[0]
                  var link = data.URL
                  var dateRaw = new Date(data.Date * 1000)
                  return (
                    <tr key={i}>
                      <td className="text">
                        <a href="#" onClick={e => this.showDetail('audio', link)}>
                          {item}
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

        </SwipeableViews>
      </div>
    );
  }
}

InfoContent.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(InfoContent);
