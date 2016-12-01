import React, { Component } from 'react';
import logotype from './logotype.svg';
import download from './download.svg';
import './App.css';
import Dropzone from 'react-dropzone'
import classNames from 'classnames'

const MAX_HEIGHT = 250
const MAX_BYTES = 5242880 // 5 megabytes

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
      isShaking: false,
    }
  }

  shake() {
    this.setState({ isShaking: true })
    // 820 ms is from CSS. DOM API sucks heuheuheu
    setTimeout(() => this.setState({ isShaking: false }), 820)
  }

  onDrop(files) {
    if (files.length !== 1) {
      this.shake()
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
    const classes = {
      'Dropzone': !this.state.file,
      'Dropzone-loaded': this.state.file,
      'Shaking': this.state.isShaking,
    }
    return (
      <div className="Uploader">
        <Dropzone
          maxSize={MAX_BYTES}
          accept={'image/*'}
          style={style}
          className={classNames(classes)}
          onDrop={this.onDrop.bind(this)} activeClassName="Dropzone-active">
          {
            (this.state.file == null) ? null :
            <img className='Dropped-image' src={this.state.file.preview} />
          }
        </Dropzone>
        {
          (this.state.file == null) ? null :
          <img className='Download' src={download} />
        }
      </div>
    );
  }

}

export default App;
