import React from 'react';
import Logo from '../Logo/Logo';
import ProfileIcon from '../Profile/ProfileIcon';

const Navigation = ({ onRouteChange, isSignedIn, toggleModal }) => {
  const renderButtons = () => {
    if (isSignedIn) {
      return (
        <ProfileIcon onRouteChange={onRouteChange} toggleModal={toggleModal} />
      );
    } else {
      return (
        <React.Fragment>
          <p
            onClick={() => onRouteChange('signin')}
            className="f3 link dim black underline pa3 pointer"
          >
            Sign In
          </p>
          <p
            onClick={() => onRouteChange('register')}
            className="f3 link dim black underline pa3 pointer"
          >
            Register
          </p>
        </React.Fragment>
      );
    }
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ marginTop: '15px' }}>
        <Logo />
      </div>
      <div
        className="buttonsWrapper"
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        {renderButtons()}
      </div>
    </nav>
  );
};

export default Navigation;
