import { useReducer } from 'react';
import './Profile.css';

const Profile = ({ isProfileOpen, toggleModal, user }) => {
  return (
    <div className="profile-modal">
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
        <main className="pa4 black-80 w-80">
          <img
            src="http://tachyons.io/img/logo.jpg"
            className="br-100 pa1 ba b--black-10 h3 w3"
            alt="avatar"
          />
          <h1>{user.name}</h1>
          <h4>{`Images Submitted: ${user.entries}`}</h4>
          <p>{`Memer since: ${new Date(user.joined).toLocaleDateString('en-UK')}`}</p>
          <hr />
          <label className="mt2 fw6" htmlFor="user-name">
            Name:
          </label>
          <input
            className="pa2 ba w-100"
            placeholder="Jane"
            type="text"
            name="user-name"
            id="user-name"
            value={user.name}
          />

          <label className="mt2 fw6" htmlFor="user-age">
            Age
          </label>
          <input
            className="pa2 ba w-100"
            placeholder="18"
            type="text"
            name="user-age"
            id="user-age"
            value={user.age}
          />

          <label className="mt2 fw6" htmlFor="user-pet">
            Pet
          </label>
          <input
            className="pa2 ba w-100"
            placeholder="Cat"
            type="text"
            name="user-pet"
            id="user-pet"
            value={user.pet}
          />
          <div
            className="mt4"
            style={{ display: 'flex', justifyContent: 'space-evenly' }}
          >
            <button className="b pa2 grow pointer hover-white w-40 bg-light-blue b--back-20">
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
};

export default Profile;
