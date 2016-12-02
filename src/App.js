import React, { Component } from 'react';
import logotype from './logotype.svg';
import download from './download.svg';
import banner from './banner.png'
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

function loadImage(src, onload) {
    let img = new Image();
    img.src = src;
    img.onload = () => {
      console.log("onload!")
      onload(img)
    }
}

function murder(profile, banner) {
  console.log('murder')
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = 500
  canvas.height = 500

  ctx.drawImage(profile, 0, 0, profile.width, profile.height,     // source rectangle
                0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, profile.width, profile.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // const brightness =
    const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
    // red
    data[i] = brightness;
    // green
    data[i + 1] = brightness;
    // blue
    data[i + 2] = brightness;
  }

  const contrast = 125
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  for (var i=0;i<data.length;i+=4) {
    data[i] = factor * (data[i] - 128) + 128;
    data[i+1] = factor * (data[i+1] - 128) + 128;
    data[i+2] = factor * (data[i+2] - 128) + 128;
  }

  for (let i = 0; i < data.length; i += 4) {
    const delta = +10
    // const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
    // red
    data[i] += delta;
    // green
    data[i + 1] += delta;
    // blue
    data[i + 2] += delta;
  }

//   brightness = function(delta) {
//     return function (pixels, args) {
//       var d = pixels.data;
//       for (var i = 0; i < d.length; i += 4) {
//         d[i] += delta;     // red
//         d[i + 1] += delta; // green
//         d[i + 2] += delta; // blue
//       }
//       return pixels;
//     };
// };

  // overwrite original image
  ctx.putImageData(imageData, 0, 0);

  ctx.drawImage(banner, 0, 0, banner.width, banner.height,
                0, canvas.height - banner.height, banner.width, banner.height)
  // const imageData = ctx.getImageData(0,0,canvas.width, canvas.height)
  // const data = imageData.data
  //
  // const grayscale = function() {
  //   for (let i = 0; i < data.length; i += 4) {
  //     const avg = (data[i] + data[i +1] + data[i +2]) / 3;
  //     data[i]     = avg; // red
  //     data[i + 1] = avg; // green
  //     data[i + 2] = avg; // blue
  //   }
  //   ctx.putImageData(imageData, 0, 0);
  // };

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
      status: null,
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

    loadImage(files[0].preview, profile => {

      if (profile.height != profile.width) {
        this.shake()
        this.setState({
          status: 'image must gotta be a square, yo. try again?',
        })
        return
      }

      if (profile.height < 200) {
        this.shake()
        this.setState({
          status: 'what is this, a profile picture for ants?',
        })
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
      console.log('wha2t')
        this.setState({
          width,
          height,
          file: files[0],
          out: murder(profile, bannerImg),
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
        <div className="Uploader-status">
          {
            !this.state.status
            ?
              <div>
                Drag and drop profile picture below.
                <br/>
                Or click the circle.
              </div>
            : <div>{this.state.status}</div>
          }
        </div>
        <Dropzone
          maxSize={MAX_BYTES}
          accept={'image/*'}
          style={style}
          className={classNames(classes)}
          onDrop={this.onDrop.bind(this)} activeClassName="Dropzone-active">
          {
            (this.state.out == null) ? null :
            <img className='Dropped-image' src={this.state.out} />
          }
          {/* {
            (this.state.file == null) ? null :
            <img className='Dropped-image' src={shopped} />
          } */}
        </Dropzone>
        {/* {
          (this.state.out == null) ? null :
          <img className='' src={this.state.out} />
        } */}
        {
          (this.state.file == null) ? null :
          <img className='Download' src={download} />
        }
      </div>
    );
  }

}

export default App;
