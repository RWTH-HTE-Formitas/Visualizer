import React, { Component } from "react";
import "./FloatingWindow.scss";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Moment from 'react-moment';

class FloatingWindow extends Component {    
    render() {
        const showWindow = this.props.data.showWindow;
        const inpData = this.props.data.objectData;
        let textNotes = [];
        let audioNotes = [];
        let imageNotes = [];
        if (inpData != null && inpData.Notes != null){
            Object.values(inpData.Notes).map((note, i) => {
                if (note.TextNotes != null){
                    textNotes = textNotes.concat(Object.values(note.TextNotes));
                }
                if (note.AudioNotes != null){
                    audioNotes = audioNotes.concat(Object.values(note.AudioNotes));
                }
                if (note.ImageNotes != null){
                    imageNotes = imageNotes.concat(Object.values(note.ImageNotes));
                }
            })
        }
        
        return (
            <div className={(showWindow) ? "window" : "window hidden"}>
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
                                    {
                                        Object.keys(inpData).map((k, i) => {
                                            const val = inpData[k]
                                            if(typeof(val) == 'string'){
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
                        </TabPanel>
                        <TabPanel>
                            <table className="table table-text">
                                <tbody>
                                    {
                                        textNotes.map((data, i) => {
                                            var item = data.URL.split('/').slice(-1)[0]
                                            var link = data.URL
                                            var dateRaw = new Date(data.Date*1000)
                                            return (
                                                <tr key={i}>
                                                    <td className="text">
                                                        <a href={link}>{item}</a>
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
                        </TabPanel>
                        <TabPanel>
                            <table className="table table-picture">
                                <tbody>
                                    {
                                        imageNotes.map((data, i) => {
                                            var link = data.URL
                                            var dateRaw = new Date(data.Date*1000)
                                            return (
                                                <tr key={i}>
                                                    <td className="text">
                                                        <a href={link}>
                                                            <img src="{link}"/>
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
                        </TabPanel>
                        <TabPanel>
                            <table className="table table-audio">
                                <tbody>
                                {
                                    audioNotes.map((data, i) => {
                                        var item = data.URL.split('/').slice(-1)[0]
                                        var link = data.URL
                                        var dateRaw = new Date(data.Date*1000)
                                        return (
                                            <tr key={i}>
                                                <td className="text">
                                                    <a href={link}>{item}</a>
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
                        </TabPanel>
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default FloatingWindow;
