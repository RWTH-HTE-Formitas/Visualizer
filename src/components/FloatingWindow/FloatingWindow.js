import React, { Component } from "react";
import "./FloatingWindow.scss";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";

class FloatingWindow extends Component {
    render() {
        return (
            <div className={(this.props.data.name !== '') ? "window" : "window hidden"}>
                <div className="window-header">
                    <span className="window-title">Object Properties</span>
                </div>
                <div className="window-content">
                    <Tabs>
                        <TabList>
                            <Tab>Info</Tab>
                            <Tab>Text</Tab>
                            <Tab>Picture</Tab>
                            <Tab>Voice</Tab>
                        </TabList>
                        <TabPanel>
                            <table className="table-info">
                                <tbody>
                                    <tr>
                                        <td>Name:</td>
                                        <td>{this.props.data.name}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </TabPanel>
                        <TabPanel>
                            <table className="table table-text">
                                <tbody>
                                    <tr>
                                        <td className="text">
                                            The pipe should be longer.
                                        </td>
                                        <td className="date">
                                            <small>Dec 12, 2018 <b>21:43</b></small>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text">
                                            Lorem ipsum dolores. The pipe should be longer.
                                        </td>
                                        <td className="date">
                                            <small>Dec 12, 2018 <b>21:43</b></small>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </TabPanel>
                        <TabPanel>
                            <table className="table table-picture">
                                <tbody>
                                    <tr>
                                        <td className="text">
                                            <img src="https://www.imgonline.com.ua/examples/random-pixels.jpg"/>
                                        </td>
                                        <td className="date"><small>Dec 12, 2018 <b>21:43</b></small></td>
                                    </tr>
                                </tbody>
                            </table>
                        </TabPanel>
                        <TabPanel>
                            <table className="table table-audio">
                                <tbody>
                                    <tr>
                                        <td className="text">
                                            <audio controls>
                                            </audio>
                                        </td>
                                        <td className="date"><small>Dec 12, 2018 <b>21:43</b></small></td>
                                    </tr>
                                </tbody>
                            </table>
                        </TabPanel>
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default FloatingWindow;
