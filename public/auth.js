/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
      document.getElementById('sign-in').disabled = false;
    });
  }
  document.getElementById('sign-in').disabled = true;
}

/**
 * Handles the sign up button press.
 */
function handleSignUp() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  if (email.length < 4) {
    alert('Please enter an email address.');
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password.');
    return;
  }
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
  });
}

/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
  firebase.auth().currentUser.sendEmailVerification().then(function() {
    alert('Email Verification Sent!');
  });
}

function sendPasswordReset() {
  var email = document.getElementById('email').value;
  firebase.auth().sendPasswordResetEmail(email).then(function() {
    alert('Password Reset Email Sent!');
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);
  });
}

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
  firebase.auth().onAuthStateChanged(function(user) {
    document.getElementById('send-email-verification').disabled = true;
    if (user) {
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      document.getElementById('sign-in-status').textContent = 'Signed in';
      document.getElementById('sign-in').textContent = 'Sign out';
      document.getElementById('account-details').textContent = JSON.stringify(user, null, '  ');
      if (!emailVerified) {
        document.getElementById('send-email-verification').disabled = false;
      }
    } else {
      document.getElementById('sign-in-status').textContent = 'Signed out';
      document.getElementById('sign-in').textContent = 'Sign in';
      document.getElementById('account-details').textContent = 'null';
    }
    document.getElementById('sign-in').disabled = false;
  });
  document.getElementById('sign-in').addEventListener('click', toggleSignIn, false);
  document.getElementById('sign-up').addEventListener('click', handleSignUp, false);
  document.getElementById('send-email-verification').addEventListener('click', sendEmailVerification, false);
  document.getElementById('send-reset-email').addEventListener('click', sendPasswordReset, false);
}
window.onload = function() {
  initApp();
};        

