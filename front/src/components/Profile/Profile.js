import { PureComponent } from 'react';
import './Profile.css';

class Profile extends PureComponent {
  constructor(props){
    super(props);

    this.state = {
      name: this.props.user.name,
      age: this.props.user.age,
      pet: this.props.user.pet
    }
  }

  handleFormChange = ev => {
    this.setState({
      [ev.target.id]: ev.target.value
    });
  }

  updateProfile = (data) => {
    fetch(`${process.env.REACT_APP_API_URL}/profile/${this.props.user.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.props.getAuthToken()
      },
      body: JSON.stringify({formInput: data})
    })
    .then(resp => {
      this.props.toggleModal();
      this.props.loadUser(this.props.user.id);
    })
    .catch(console.log);
  }

  render() {
    const {user, toggleModal} = this.props;
    const {name, age, pet } = this.state;

    return (
      <div className="profile-modal">
        <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
          <main className="pa4 black-80 w-80">
            <img
              src="http://tachyons.io/img/logo.jpg"
              className="br-100 pa1 ba b--black-10 h3 w3"
              alt="avatar"
            />
            <h1>{name}</h1>
            <h4>{`Images Submitted: ${user.entries}`}</h4>
            <p>{`Memer since: ${new Date(user.joined).toLocaleDateString(
              'en-UK'
            )}`}</p>
            <hr />
            <label className="mt2 fw6" htmlFor="name">
              Name:
            </label>
            <input
              className="pa2 ba w-100"
              placeholder="Jane"
              type="text"
              name="user-name"
              id="name"
              value={name}
              onChange={this.handleFormChange}
            />

            <label className="mt2 fw6" htmlFor="age">
              Age
            </label>
            <input
              className="pa2 ba w-100"
              placeholder="18"
              type="text"
              name="user-age"
              id="age"
              value={age}
              onChange={this.handleFormChange}
            />

            <label className="mt2 fw6" htmlFor="pet">
              Pet
            </label>
            <input
              className="pa2 ba w-100"
              placeholder="Cat"
              type="text"
              name="user-pet"
              id="pet"
              value={pet}
              onChange={this.handleFormChange}
            />
            <div
              className="mt4"
              style={{ display: 'flex', justifyContent: 'space-evenly' }}
            >
              <button 
                className="b pa2 grow pointer hover-white w-40 bg-light-blue b--back-20"
                onClick={() => this.updateProfile(this.state)}
              >
                Save
              </button>
              <button
                className="b pa2 grow pointer hover-white w-40 bg-light-red b--back-20"
                onClick={toggleModal}
              >
                Cancel
              </button>
            </div>
          </main>
          <div className="modal-close" onClick={toggleModal}>
            &times;
          </div>
        </article>
      </div>
    );
  }
}

export default Profile;
