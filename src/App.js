import React, { PureComponent } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

import './App.css';

const particleOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        area: 800,
      },
    },
    line_linked: {
      shadow: {
        enable: true,
        color: '#3ca9d1',
        blur: 5,
      },
    },
    color: '#7b1fa2',
    links: {
      color: 'rgba(100,181,246,0.4)',
    },
  },
};

const clarifaiApp = new Clarifai.App({
  apiKey: '138dc56a9eae4ed29cb20fd120a786cd',
});

class App extends PureComponent {
  constructor() {
    super();

    this.state = {
      input: '',
      imageUrl: '',
      box: {}
    };
  }

  calculateFaceLocation = () => {
    
  }

  onInputChangeHandler = (ev) => {
    this.setState({input: ev.target.value});
  };

  onSubmitHandler = () => {
    this.setState({imageUrl: this.state.input});

    clarifaiApp.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input
      )
      .then((response) => console.log(response.outputs[0].data.regions))
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particleOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChangeHandler}
          onSubmit={this.onSubmitHandler}
        />
        <FaceRecognition imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
