import React, { Component } from 'react';
import Visualizer from './components/Visualizer/Visualizer';

class App extends Component {

  render() {

    return (
      <div style={{width: '1000px', margin: '1em auto'}}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12" style={{width:'100%'}}>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="#">Formitas</a></li>
                  <li className="breadcrumb-item"><a href="#">Project ABC</a></li>
                  <li className="breadcrumb-item active" aria-current="page">Defect Notes</li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <h1 style={{margin: "1em 0 1em 0"}}>Project ABC - Defect Notes</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <Visualizer/>
            </div>
          </div>
          <div className="row" style={{margin: "2em 0"}}>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Description</th>
                  <th scope="col">&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>3j5F884vL4FwalfxCgxQmY</td>
                  <td>Table Conference 8 Seater(2):Table Conference 8 Seater(2):436926</td>
                  <td className="text-right"><a href="#">Show</a></td>
                </tr>
                <tr>
                    <td>3pzckBGIL5Q9PFDqNgFP7P</td>
                    <td>Türelement 1-flg - Drehflügel - Glas:Standard:397121</td>
                    <td className="text-right"><a href="#" className="pull-right">Show</a></td>
                </tr>
                <tr>
                    <td>3tBp77pb1909KOfrHDFphD</td>
                    <td>Systemelement:Verglasung:424193</td>
                    <td className="text-right"><a href="#" className="pull-right">Show</a></td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td className="text-muted">3 entries</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
