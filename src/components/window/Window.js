import React, { Component } from 'react';
import './Window.scss';

class FloatingWindow extends Component {
    render() {
        return (
            <div className="window">
                <FloatingWindowHeader />
                <FloatingWindowContent data={this.props.data} />
            </div>
        );
    }
}

class FloatingWindowHeader extends Component {
    render() {
        return (
            <div className="window-header">
                <span className="window-title">Object Properties</span>
            </div>
        );
    }
}

class FloatingWindowContent extends Component {
    render() {
        return (
            <div className="window-content">
                <table>
                    <tbody>
                        <tr>
                            <td>Name</td>
                            <td>: {this.props.data.name}</td>
                        </tr>
                        <tr>
                            <td>Annotations</td>
                            <td>: {this.props.data.annotation}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default FloatingWindow;