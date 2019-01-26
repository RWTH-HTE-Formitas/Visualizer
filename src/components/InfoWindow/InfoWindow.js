
import React, {Component} from "react";
import InfoContent from './InfoContent';

class InfoWindow extends Component {

  render() {

    return (
      <InfoContent data={this.props.data} />
    );
  }
}

export default (InfoWindow);
