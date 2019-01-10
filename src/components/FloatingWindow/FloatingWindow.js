import React, { Component } from "react";
import "./FloatingWindow.scss";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Moment from 'react-moment';
import ReactModal from 'react-modal';

class FloatingWindow extends Component {
    constructor() {
        super();
        this.state = {
            showModal: false
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);

        this.showDetail = this.showDetail.bind(this);
    }

    detail = null;

    handleOpenModal(type, source) {
        
        switch(type) {
            case 'text':
                // override
                source = 'https://raw.githubusercontent.com/RWTH-HTE-Formitas/Visualizer/tmp/sample.txt';
                const request = async () => {
                    const response = await fetch(source);
                    const json = await response.text();
                    this.detail = <textarea readOnly={true}>{json}</textarea>
                    this.setState({ showModal: true });
                }
                request();
                break;
            case 'audio':
                // override
                source = 'https://raw.githubusercontent.com/RWTH-HTE-Formitas/Visualizer/tmp/sample.mp3';
                this.detail = <audio controls><source src={source} type="audio/mp3" /></audio>
                this.setState({ showModal: true });
                break;
            case 'image':
                // override
                source = 'https://raw.githubusercontent.com/RWTH-HTE-Formitas/Visualizer/tmp/sample.jpg';
                this.detail = <img src={source} />
                this.setState({ showModal: true });
                break;
        }
    }

    componentDidMount(){
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    showDetail(type, source) {
        this.handleOpenModal(type, source);
    }

    render() {
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

        let classes = ["border", "window"];
        if (!showWindow)
        {
            classes.push("hidden");
        }

        return (
            <div ref={99} className={classes.join(" ")}>
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
                        </TabPanel>
                        <TabPanel>
                            <table className="table table-text">
                                <tbody>
                                    {
                                        textNotes.map((data, i) => {
                                            var item = data.URL.split('/').slice(-1)[0]
                                            var link = data.URL
                                            var dateRaw = new Date(data.Date * 1000)
                                            return (
                                                <tr key={i}>
                                                    <td className="text">
                                                        <a href="#" onClick={e => this.showDetail('text', link)}>{item}</a>
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
                        </TabPanel>
                        <TabPanel>
                            <table className="table table-audio">
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
                        </TabPanel>
                    </Tabs>
                </div>
                <ReactModal
                    isOpen={this.state.showModal}
                    contentLabel="onRequestClose Example"
                    onRequestClose={this.handleCloseModal}
                    className="Modal"
                    overlayClassName="Overlay"
                >
                    <div className="header">
                        <button onClick={this.handleCloseModal}>Close</button>
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

export default FloatingWindow;
