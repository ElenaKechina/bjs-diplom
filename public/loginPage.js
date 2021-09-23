const loginForm = new UserForm();
loginForm.loginFormCallback = (requestBody) => {
  ApiConnector.login(requestBody, (responseBody) => {
    if (responseBody.success) {
      location.reload();
    } else {
      loginForm.setLoginErrorMessage(responseBody.error);
    }
  });
};

loginForm.registerFormCallback = (requestBody) => {
  ApiConnector.register(requestBody, (responseBody) => {
    if (responseBody.success) {
      location.reload();
    } else {
      loginForm.setRegisterErrorMessage(responseBody.error);
    }
  });
};
