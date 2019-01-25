import React, { Component } from "react";
import { Typography, Button, Paper } from "@material-ui/core/";
import { withStyles } from '@material-ui/core/styles';
import InfoContent from './InfoContent';
const styles = {

    root: {},

  };

class InfoWindow extends Component {
    constructor() {
        super();
        this.state = {
            showModal: false
        };
    }

    componentDidMount()
    {
    }

    render() {
        const { classes } = this.props;

        return (
           <React.Fragment>
               <div className={classes.root}><InfoContent data={this.props.data}></InfoContent></div>
           </React.Fragment>
        );
    }
}

export default withStyles(styles)(InfoWindow);
