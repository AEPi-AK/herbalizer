import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Dropzone from 'react-dropzone'

class App extends Component {
  render() {
    return (
      <div className="App">
        <UploadZone/>
      </div>
    );
  }
}

class UploadZone extends Component {

  constructor(props) {
    super(props)
    this.state = {
      file: null,
    }
  }

  onDrop(files) {
    if (files.length !== 1) {
      alert("files.length !== 1")
    }
    this.setState({
      file: files[0],
    })
  }

  render() {
    console.log(this.state.file)
    return (
      <div>
        <Dropzone onDrop={this.onDrop.bind(this)}>
          <div>Drag profile here or click to upload.</div>
        </Dropzone>
        {
          (this.state.file == null) ? null :
          <div>
            <img src={this.state.file.preview} />
          </div>
        }
      </div>
    );
  }

}

export default App;
