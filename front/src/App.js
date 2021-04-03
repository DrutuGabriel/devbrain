import React, { PureComponent } from 'react';
import Particles from 'react-particles-js';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Profile from './components/Profile/Profile';
import Modal from './components/Modal/Modal';

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

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  signedIn: false,
  isProfileOpen: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
    pet: '',
    age: '',
  },
};

class App extends PureComponent {
  constructor() {
    super();

    this.state = initialState;
  }

  componentDidMount(){
    const token = this.getAuthToken();

    if(token){
      fetch('http://localhost:8000/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(data => data.json())
      .then(data => {
        if(data.success){
          this.onLoadUser(data.userId, token);
          this.setState({
            signedIn: true,
            route: 'home'
          });
        }
      });
    }
  }

  onLoadUser = (userId) => {
    const token = this.getAuthToken();

    fetch(`http://localhost:8000/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    })
    .then(response => response.json())
    .then((userData) => {
      if (!userData || !userData.id) {
        return console.log('Something went wrong.');
      }

      this.setState((prevState) => ({
        ...prevState,
        user: {
          id: userData.id,
          name: userData.name,
          age: userData.age,
          pet: userData.pet,
          email: userData.email,
          entries: userData.entries,
          joined: userData.joined,
        },
      }));
    });
  };

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

    fetch('http://localhost:8000/image-url', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': this.getAuthToken()
      },
      body: JSON.stringify({ input: this.state.input }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          fetch('http://localhost:8000/image', {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': this.getAuthToken()
            },
            body: JSON.stringify({ id: this.state.user.id }),
          })
            .then((response) => response.json())
            .then((response) => {
              if (response.success) {
                this.setState(
                  Object.assign(this.state.user, { entries: response.entries })
                );
              }
            });
        }

        this.displayFaceBox(
          this.calculateFaceLocations(response.outputs[0].data.regions)
        );
      })
      .catch((err) => console.log(err));
  };

  getAuthToken = () => {
    return window.sessionStorage.getItem('token');
  }

  onRouteChangeHandler = (route, signedIn = null) => {
    const newState = { route };
    if (signedIn !== null) {
      newState.signedIn = signedIn;
    } 

    if(route === 'signout') {
      this.removeSessionToken();
      return this.setState({...initialState, route: 'signin'});
    }

    this.setState(newState);
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      isProfileOpen: !prevState.isProfileOpen,
    }));
  };

  removeSessionToken = () => {
    window.sessionStorage.removeItem('token');
  }

  render() {
    const {
      signedIn,
      imageUrl,
      route,
      boxes,
      isProfileOpen,
      user,
    } = this.state;

    return (
      <div className="App">
        <Particles className="particles" params={particleOptions} />
        <Navigation
          onRouteChange={this.onRouteChangeHandler}
          isSignedIn={signedIn}
          toggleModal={this.toggleModal}
        />
        {isProfileOpen && (
          <Modal>
            <Profile
              loadUser={this.onLoadUser}
              toggleModal={this.toggleModal}
              user={user}
              getAuthToken={this.getAuthToken}
            />
          </Modal>
        )}

        {route === 'home' ? (
          <React.Fragment>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChangeHandler}
              onSubmit={this.onSubmitHandler}
            />
            <FaceRecognition imageUrl={imageUrl} faceBoxes={boxes} />
          </React.Fragment>
        ) : route === 'signin' ? (
          <SignIn
            loadUser={this.onLoadUser}
            onRouteChange={this.onRouteChangeHandler}
          />
        ) : (
          <Register
            loadUser={this.onLoadUser}
            onRouteChange={this.onRouteChangeHandler}
          />
        )}
      </div>
    );
  }
}

export default App;
