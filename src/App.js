import React, { PureComponent } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

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
      boxes: [],
      route: 'signin',
      signedIn: false
    };
  }

  calculateFaceLocations = (regions) => {
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    return regions.map((region) => {
      const clarifaiFace = region.region_info.bounding_box;

      return {
        leftCol: clarifaiFace.left_col * width,
        rightCol: width - clarifaiFace.right_col * width,
        topRow: clarifaiFace.top_row * height,
        bottomRow: height - clarifaiFace.bottom_row * height,
      };
    });
  };

  displayFaceBox = (boxes) => {
    this.setState({ boxes });
  };

  onInputChangeHandler = (ev) => {
    this.setState({ input: ev.target.value });
  };

  onSubmitHandler = () => {
    this.setState({ imageUrl: this.state.input, boxes: [] });

    clarifaiApp.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) => {
        this.displayFaceBox(
          this.calculateFaceLocations(response.outputs[0].data.regions)
        );
      })
      .catch((err) => console.log(err));
  };

  onRouteChangeHandler = (route, signedIn = null) => {
    const newState = {route}
    if(signedIn !== null){
      newState.signedIn = signedIn;
    }

    this.setState(newState);
  };

  render() {
    const {signedIn, imageUrl, route, boxes} = this.state;

    return (
      <div className="App">
        <Particles className="particles" params={particleOptions} />
        <Navigation 
          onRouteChange={this.onRouteChangeHandler} 
          isSignedIn={signedIn}
        />
        
        {route === 'home' ? (
          <React.Fragment>    
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChangeHandler}
              onSubmit={this.onSubmitHandler}
            />
            <FaceRecognition
              imageUrl={imageUrl}
              faceBoxes={boxes}
            />
          </React.Fragment>
        ) : route === 'signin' ? (
          <SignIn onRouteChange={this.onRouteChangeHandler} />
        ) : (
          <Register onRouteChange={this.onRouteChangeHandler} />
        )}
      </div>
    );
  }
}

export default App;
