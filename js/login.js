var loggato = false,
  username = "";

window.onload = () => {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "../php/login.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onload = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        var data = xhr.response;
        if (data != "notLogged") {
          username = data;
          loggato = true;
          document.getElementById("login-icon").style.display = "none";
          document.getElementById("logoutList").style.display = "flex";
          document.getElementById("benvenuto").innerHTML = username;
        }
      }
    }
  };
  xhr.send("logged=" + true);
};

function changePage(path) {
  if (username != "") {
    window.location.href = path;
  } else {
    alert("Effettua il login per continuare!");
  }
}

function logout() {
  document.getElementById("login-icon").style.display = "block";
  document.getElementById("logoutList").style.display = "none";
  let xhr = new XMLHttpRequest();
  xhr.open("post", "../php/login.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onload = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        var data = xhr.response;
        if (data == "logout") {
          username = "";
          loggato = false;
          var alert = confirm("Logout effettuato!");
          if (alert) location.reload();
        }
      }
    }
  };
  xhr.send("logout=" + true);
}

//funzione che permette di alternare login e registrazione
function LogToSignUp(id_da_togliere, id_da_mostrare) {
  document.getElementById("oscurazione").style.display = "flex";
  document.getElementById(id_da_togliere).style.display = "none";
  document.getElementById(id_da_mostrare).style.display = "flex";
  var pswdField, toggleBtn, form, continueBtn;

  if (id_da_mostrare == "div-login") {
    pswdField = document.querySelector("#password_field_login");
    (toggleBtn = document.querySelector("#occhio-login")),
      (form = document.querySelector("#div-login form")),
      (continueBtn = document.querySelector("#div-login .button input"));
  } else {
    (pswdField = document.querySelector("#password_field_reg")),
      (toggleBtn = document.querySelector(".form .field i")),
      (form = document.querySelector("#div-reg form")),
      (continueBtn = form.querySelector(".button input"));

    var pswdConfField = document.querySelector("#password_field_conf"),
      toggleConfBtn = document.querySelector("#occhio-conf-password");

    toggleConfBtn.onclick = function () {
      showPswd(pswdConfField, toggleConfBtn);
    };

    //creazione di costanti contenenti il form e il submit del login
  }

  toggleBtn.onclick = function () {
    showPswd(pswdField, toggleBtn);
  };

  formDataCheck(form, continueBtn);
}

//funzione che chiude i form di login/registrazione
function closeLogin() {
  document.getElementById("oscurazione").style.display = "none";
}

//funzione che controlla i dati del form registrazione e li invia al server
function formDataCheck(form, button) {
  form.onsubmit = (e) => {
    e.preventDefault();
  };

  button.onclick = () => {
    //ajax
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../php/login.php", true);
    xhr.onload = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          var data = xhr.response;
          if (data == "dati inseriti!" || data == "Login effettuato!") {
            loggato = true;
            closeLogin();
            alert("Benvenuto " + username);
            document.getElementById("login-icon").style.display = "none";
            document.getElementById("logoutList").style.display = "flex";
            document.getElementById("benvenuto").innerHTML = username;
          } else if (data == "usernameNotAvailable") {
            alert("L'username è già utilizzato!");
            form.username.focus();
          } else if (data == "emailNotAvailable") {
            alert("L'Email è già utilizzata!");
            form.email.focus();
          } else if (data == "emailNotEmail") {
            alert("Email non valida!");
            form.email.focus();
          } else if (data == "credenziali Errate!") {
            alert("Credenziali Errate!");
            form.username.focus();
          }
        }
      }
    };
    var formData = new FormData(form);

    if (form.name == "reg") {
      if (form.password.value != form.conf_password.value) {
        alert("Password diverse");
        form.conf_password.focus();
      } else if (
        form.password.value.length < 8 ||
        form.password.value.length > 16
      ) {
        alert(
          "Formato password errato, la lunghezza deve essere tra 8 e 16 caratteri!"
        );
        form.password.focus();
      } else {
        username = form.username.value;
        xhr.send(formData);
      }
    } else {
      username = form.username.value;
      xhr.send(formData);
    }
  };
}

//funzione che nel form mostra e nasconde la password
function showPswd(pswd, button) {
  if (pswd.type == "password") {
    pswd.type = "text";
    button.className = "fas fa-eye";
  } else {
    pswd.type = "password";
    button.className = "fas fa-eye-slash";
  }
}
