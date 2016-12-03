import React, { Component } from 'react';
import logotype from './logotype.svg';
import download from './download.svg';
import banner from './banner.png'
import './App.css';
import Dropzone from 'react-dropzone'
import classNames from 'classnames'

const MAX_HEIGHT = 250
const MAX_BYTES = 5242880 // 5 megabytes
const SQUARE_FORGIVENESS = 0.05

class App extends Component {
  render() {
    return (
      <div className="App">
        <img alt='Murder Ballad' className="Logo" src={logotype}/>
        <UploadZone/>
        <div className="Footer">
        <a href="http://avi.bio" target="_blank">built & designed by Avi</a>
        </div>
      </div>
    );
  }
}

function loadImage(src, onload) {
    let img = new Image();
    img.src = src;
    img.onload = () => onload(img)
}

function applyMurderFilter(profile, banner) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = 500
  canvas.height = 500

  ctx.drawImage(profile, 0, 0, profile.width, profile.height,     // source rectangle
                0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, profile.width, profile.height);
  const data = imageData.data;

  // Desaturate
  for (let i = 0; i < data.length; i += 4) {
    const saturation = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
    data[i] = saturation;
    data[i + 1] = saturation;
    data[i + 2] = saturation;
  }

  // Increase contrast
  const contrast = +125
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  for (let i = 0; i < data.length; i += 4) {
    data[i] = factor * (data[i] - 128) + 128;
    data[i+1] = factor * (data[i+1] - 128) + 128;
    data[i+2] = factor * (data[i+2] - 128) + 128;
  }

  // Increase brightness
  const brightness = +20
  for (let i = 0; i < data.length; i += 4) {
    data[i] += brightness;
    data[i + 1] += brightness;
    data[i + 2] += brightness;
  }

  ctx.putImageData(imageData, 0, 0);
  ctx.drawImage(banner, 0, 0, banner.width, banner.height,
                0, canvas.height - banner.height, banner.width, banner.height)

  return canvas.toDataURL('image/png')
}

class UploadZone extends Component {

  constructor(props) {
    super(props)
    this.state = {
      file: null,
      width: 0,
      height: 0,
      isShaking: false,
      status: 'Drag and drop profile picture below. Or click the circle.',
    }
  }

  setStatus(status) {
    this.setState({
      status,
    })
  }

  shake() {
    this.setState({ isShaking: true })
    // 820 ms is from CSS. DOM API sucks heuheuheu
    setTimeout(() => this.setState({ isShaking: false }), 820)
  }

  onDownload() {

  }

  onDrop(files) {

    if (files.length !== 1) {
      this.shake()
      this.setStatus('hey, this thing only accepts images — one at a time!')
      return
    }

    loadImage(files[0].preview, profile => {
      if (Math.abs(1 - (profile.height / profile.width)) > SQUARE_FORGIVENESS) {
        this.shake()
        this.setStatus('the image has to be square-ish dimensions, sorry. try again?')
        return
      }

      if (profile.height < 200) {
        this.shake()
        this.setStatus('what the hell is this, a profile picture for ants!?')
        return
      }

      let height, width

      // no resizing needed
      if (profile.height < MAX_HEIGHT) {
        height = profile.height
        width = profile.width
      }
      // resize but maintain aspect ratio
      else {
        height = MAX_HEIGHT
        width = profile.width * (MAX_HEIGHT / profile.height)
      }

      loadImage(banner, bannerImg => {
        this.setState({
          width,
          height,
          file: files[0],
          out: applyMurderFilter(profile, bannerImg),
          status: 'ta-da! thanks for being awesome <3',
        })
      })
    })
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
        {
          <div className="Uploader-status">{this.state.status}</div>
        }
        <Dropzone
          maxSize={MAX_BYTES}
          accept={'image/*'}
          style={style}
          className={classNames(classes)}
          onDrop={this.onDrop.bind(this)} activeClassName="Dropzone-active">
          {
            (this.state.out == null) ? null :
            <img alt='generated profile' className='Dropped-image' src={this.state.out} />
          }
        </Dropzone>
        {
          !this.state.file ? null :
          <a href={this.state.out} download="murderballad-profile.png">
            <img alt='download' className='Download' onClick={this.onDownload.bind(this)} src={download} />
          </a>
        }
      </div>
    );
  }

}

export default App;
