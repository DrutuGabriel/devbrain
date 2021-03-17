import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';

const particleOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        area: 800
      }
    },
    line_linked: {
      shadow: {
        enable: true,
        color: '#3ca9d1',
        blur: 5,
      },
    },
    color: "#7b1fa2",
    links: {
      color: "rgba(100,181,246,0.4)"
    }
  }
};

function App() {
  return (
    <div className="App">
      <Particles className="particles" params={particleOptions} />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm />
      <FaceRecognition />
    </div>
  );
}

export default App;
