import React, { Component } from 'react';
import logotype from './logotype.svg';
import './App.css';
import Dropzone from 'react-dropzone'

const MAX_HEIGHT = 250

class App extends Component {
  render() {
    return (
      <div className="App">
        <img className="Logo" src={logotype}/>
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
      width: 0,
      height: 0,
    }
  }

  onDrop(files) {
    if (files.length !== 1) {
      alert("files.length !== 1")
      return
    }

    let img = new Image()
    img.src = files[0].preview

    // Image needs to load before we can access width and height
    img.onload = () => {
      let height, width

      // no resizing needed
      if (img.height < MAX_HEIGHT) {
        height = img.height
        width = img.width
      }
      // resize but maintain aspect ratio
      else {
        height = MAX_HEIGHT
        width = img.width * (MAX_HEIGHT / img.height)
      }

      this.setState({
        width,
        height,
        file: files[0],
      })
    }
  }

  render() {
    let style = {}
    if (this.state.file) {
      style = {
        width: this.state.width,
        height: this.state.height,
      }
    }
    return (
      <div className="Uploader">
        <Dropzone style={style} className={this.state.file ? 'Dropzone-loaded' : 'Dropzone'} onDrop={this.onDrop.bind(this)} activeClassName="Dropzone-active">
          {
            (this.state.file == null) ? null :
            <img className='Dropped-image' src={this.state.file.preview} />
          }
        </Dropzone>

      </div>
    );
  }

}

export default App;
