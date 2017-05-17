$(() => {
  $('#register-form').validate({
    rules: {
      firstName: 'required',
      lastName: 'required',
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 5,
      },
      confirmPassword: {
        required: true,
        minlength: 5,
        equalTo: '#password'
      }
    },
    messages: {
      firstName: 'Please enter a your firstname!',
      lastName: 'Please enter a your lastname!',
      password: {
        required: 'Please enter a password!',
        minlength: 'Your password must contain at least 5 characters long!',
      },
      confirmPassword: {
        required: 'Please provide a password',
        minlength: 'Your password must be at least 5 characters long!',
        equalTo: 'Please enter the same password as above.'
      }
    },

    invalidHandler: (event, validator) => {

    },
    submitHandler: (form) => {
      form.ajaxSubmit();
    }
  });

  // const validateForm = () => {
  //   let firstName = $('#firstName').val(),
  //   lastName = $('#lastName').val(),
  //   email = $('#email').val(),
  //   state = $('#state').val(),
  //   country = $('#email').val(),
  //   password = $('#password').val(),
  //   confirmPassword = $('#confirmPassword').val();

  //   const firstNameError = () => {
  //     if (firstName.length > 2) {}
  //   };
  // };
});
