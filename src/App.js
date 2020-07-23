import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    password: '',
    isValid: false,
    error: '',
    existingUser:false
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,

        }
        setUser(signedInUser);
      })
      .catch(err => {
        console.log(err)
        console.log(err.massage)
      })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: '',
          isValid: false
        }
        setUser(signOutUser);
      })
      .catch(err => {

      })
  }
  const is_valid_email = (email) => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = (password) => /\S/.test(password);
  // const is_valid_password=(password)=>
  const handleChange = (e) => {
    const newUserInfo = {
      ...user
    }


    //perform validation
    let isValid = true;
    if (e.target.name === 'email') {
      isValid = is_valid_email(e.target.value);
    }
    if (e.target.name === 'password') {
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }
    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }
  const createAccount = (event) => {
    if (user.isValid) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res)
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser)
        })
        .catch(err => {
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser)
        })
    } else {
      console.log('form is not valid')
    }
    event.preventDefault();
    event.target.reset();
  }
  const signInUser = (event) => {
    if (user.isValid) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res)
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser)
        })
        .catch(err => {
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser)
        })
    }
    event.preventDefault();
    event.target.reset();
  }
  const switchForm = (e) => {
    const createdUser = { ...user };
    createdUser.existingUser = e.target.checked;
    setUser(createdUser)

  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> : <button onClick={handleSignIn}>Sign in</button>
      }
      {
        user.isSignedIn && <div>
          <h3>Welcome, {user.name}</h3>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }
      <div>
        <h1>Our Own Authentication</h1>
        <label htmlFor="switchForm"> 
          <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm"/>
          Returning User
        </label>
        <form onSubmit={signInUser} style={{display:user.existingUser ? 'block':'none'}}>
          <input type="email" name="email" onBlur={handleChange} placeholder="Your Email" required />
          <br />
          <input type="password" name="password" onBlur={handleChange} placeholder="Your Password" required />
          <br />
          <input type="submit" value="Login" />
        </form>
        {/* Create a New accaount */}
        <form onSubmit={createAccount} style={{display:user.existingUser?'none':'block'}}>
          <input type="text" name="name" onBlur={handleChange} placeholder="Your Name" required />
          <br />
          <input type="email" name="email" onBlur={handleChange} placeholder="Your Email" required />
          <br />
          <input type="password" name="password" onBlur={handleChange} placeholder="Your Password" required />
          <br />
          <input type="submit" value="Create Account" />
        </form>
        {
          user.error && <p style={{ color: 'red' }}>{user.error}</p>
        }
      </div>
    </div>
  );
}

export default App;
