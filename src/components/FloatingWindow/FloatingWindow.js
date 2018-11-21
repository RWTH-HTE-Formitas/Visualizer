import React, { Component } from "react";
import "./FloatingWindow.scss";

class FloatingWindow extends Component {
    render() {
        return (
            <div className={(this.props.data.name !== '') ? "window" : "window hidden"}>
                <div className="window-header">
                    <span className="window-title">Object Properties</span>
                </div>
                <div className="window-content">
                    <table>
                        <tbody>
                            <tr>
                                <td>Name:</td>
                                <td>{this.props.data.name}</td>
                            </tr>
                            <tr>
                                <td>Annotation:</td>
                                <td>{this.props.data.annotation}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default FloatingWindow;
