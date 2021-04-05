import React, { PureComponent } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

class ProfileIcon extends PureComponent {
  constructor() {
    super();

    this.state = {
      dropdownOpen: false,
    };
  }

  toggle = () => {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  };

  render() {
    return (
      <div className="tc pa4">
        <Dropdown
          isOpen={this.state.dropdownOpen}
          toggle={this.toggle}
        >
          <DropdownToggle
            tag="span"
            data-toggle="dropdown"
            aria-expanded={this.state.dropdownOpen}
          >
            <img
              src="https://tachyons.io/img/logo.jpg"
              className="br-100 pa1 ba b--black-10 h3 w3"
              alt="avatar"
            />
          </DropdownToggle>
          <DropdownMenu
            right
            className="b--transparent shadow-5"
            style={{
              marginTop: '20px',
              backgroundColor: 'rgba(255, 255,255,0.7)',
            }}
          >
            <DropdownItem
              onClick={this.props.toggleModal}
            >
              View Profile
            </DropdownItem>
            <DropdownItem
              onClick={() => this.props.onRouteChange('signout')}
            >
              Sign Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

export default ProfileIcon;
