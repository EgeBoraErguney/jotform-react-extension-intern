
function myFunction() {
  var inputs = document.getElementsByTagName("input");
  var username,password;
  for (var i = 0; i < inputs.length; i++) {
    if (
      inputs[i].type.toLowerCase() == "email" ||
      inputs[i].type.toLowerCase() == "username" ||
      inputs[i].type.toLowerCase() == "name" ||
      inputs[i].type.toLowerCase() == "user"
    ) {
        username = (inputs[i].value);
    }
    if (inputs[i].type.toLowerCase() == "password") {
        password = (inputs[i].value);
    }
  }
  return {
      username: username,
      password: password
  }
}