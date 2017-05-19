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
      if (confirmPassword !== password) {
        return 'enter correct password!';
      }
    };
  });
});
