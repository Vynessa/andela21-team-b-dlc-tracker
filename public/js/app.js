$(() => {
  // $('.dropdown-button').dropdown();
  $('.slider').slider();
  $('.button-collapse').sideNav();
  $('.modal').modal();

  /* Form validation for the registration form */
  // First disable submit button on registration form on page load
  $('#register-btn').attr('disabled', true);
  $('form').keyup(() => {
    // Then disable Submit Button
    $('#register-btn').attr('disabled', true);

    // Grab the values for every field
    const fname = $('#firstName').val(),
      lname = $('#lastName').val(),
      state = $('#state').val(),
      country = $('#email').val(),
      phoneNum = $('#phoneNo').val(),
      email = $('#email').val(),
      password = $('#password').val(),
      confirmPassword = $('#confirmPassword').val(),
      filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;

    if (!fname === ''
          || lname === ''
          || state === ''
          || country === ''
          || phoneNum === ''
          || email === ''
          || password === ''
          || confirmPassword === '') {
      return 'Please enter all fields';
    } else if (filter.test(email)) {
      $('#register-btn').removeAttr('disabled', false);
    }

    const confirmPasswordError = () => {
      if(confirmPassword !== password) {
        return 'enter correct password!'
      }
    }
  });

  /* Form validation for the Login form */


  // $('#register-btn').click(() => {
  //   const fname = $('#firstName').val(),
  //     lname = $('#lastName').val(),
  //     state = $('#state').val(),
  //     country = $('#email').val(),
  //     email = $('#email').val(),
  //     password = $('#password').val(),
  //     confirmPassword = $('#confirmPassword').val();

  //   const firstNameError = () => {
  //     if (fname.length === 0) {
  //       return 'Please input your first name';
  //     } else if (fname.length < 3) {
  //       return 'Your first name must contain more than 3 characters';
  //     }
  //   };

  //   const lastNameError = () => {
  //     if (lname.length === 0) {
  //       return 'Please input your last name';
  //     } else if (fname.length < 3) {
  //       return 'Your last name must contain more than 3 characters';
  //     }
  //   };

  //   const emailError = () => {

  //   };

  //   const passwordError = () => {

  //   };
  // });

//   $('.modal').modal({
//     dismissible: true, // Modal can be dismissed by clicking outside of the modal
//     opacity: 0.5, // Opacity of modal background
//     inDuration: 300, // Transition in duration
//     outDuration: 200, // Transition out duration
//     startingTop: '4%', // Starting top style attribute
//     endingTop: '10%', // Ending top style attribute
//     ready: (modal, trigger) => { // Callback for Modal open. Modal and trigger parameters available.
//       alert('Ready');
//       console.log(modal, trigger);
//     },
//     complete: () => { alert('Closed'); } // Callback for Modal close
//   }
// );
});

