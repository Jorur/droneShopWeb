const inputUser = document.querySelector('#inputUsername');
const inputPass = document.querySelector('#inputPassword');
const btnLogin = document.querySelector('#btnLogin');

const loginNav = document.querySelector('#loginBtnNav');
const navList = document.querySelector('#navList');
const navcol = document.querySelector('#navcol-1');

const btnConfirmCredentials = document.querySelector('#btnConfirmCredentials');
const saveBtn = document.querySelector('#saveButton');

const loginUserData = {
    username: "",
    password: ""
}

const loggedUser = {
    id: 0,
    fullName: "",
    username: "",
    mail: "",
    gender: "",
    birthDate: "",
    phoneNumber: 0,
    role: "",
    address: ""
}


//Clases
class UI {
    showMessage(message, cssClass, whereToAppend) {
        const alert = document.createElement('div');
        alert.classList.add('alert', `alert-${cssClass}`, 'text-center');
        alert.textContent = message
        alert.style.marginTop = "10px";
        whereToAppend.appendChild(alert);
        setTimeout(() => {
            alert.remove();
        }, 2000);
    }
}

const ui = new UI();

//Function
eventListeners();

function eventListeners() {

    if (btnLogin) {
        btnLogin.addEventListener('click', loginUser);
    }

    if (btnConfirmCredentials) {
        btnConfirmCredentials.addEventListener('click', saveNewData);
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', validateData);
    }

    document.addEventListener('DOMContentLoaded', () => {
        validateLoggedUser();
        loadLoggedUserData();
    });
}

function loginUser(e) {
    e.preventDefault();
    if (inputUser.value === "" || inputPass.value === "") {
        const alert = document.createElement('div');
        alert.classList.add('alert', 'alert-danger', 'text-center');
        alert.textContent = "Todos los campos son obligatorios";
        document.querySelector('#formLogin').appendChild(alert);
        setTimeout(() => {
            alert.remove();
        }, 2000);
        return;
    }
    loginUserData.username = inputUser.value;
    loginUserData.password = inputPass.value;
    loginUserAsync(loginUserData).then(
        responseAuth => {
            getUserData(loginUserData).then(responseUserData => {
                if (responseAuth.status === 200) {
                    responseUserData.json().then(data => {
                        loggedUser.id = data.id;
                        loggedUser.fullName = data.fullName;
                        loggedUser.username = data.username;
                        loggedUser.mail = data.mail;
                        loggedUser.gender = data.gender;
                        loggedUser.birthDate = data.birthDate;
                        loggedUser.phoneNumber = data.phoneNumber;
                        loggedUser.role = data.role;
                        loggedUser.address = data.address;
                        localStorage.setItem('user', JSON.stringify(loggedUser));
                        loadLoggedUserData();
                    });
                    window.location.href = 'index.html';
                } else {
                    const alert = document.createElement('div');
                    alert.classList.add('alert', 'alert-danger', 'text-center');
                    alert.textContent = "Usuario o contraseña incorrectos";
                    document.querySelector('#formLogin').appendChild(alert);
                    setTimeout(() => {
                        alert.remove();
                    }, 5000);
                }
            });
        }
    );
}

async function loginUserAsync(data) {
    try {
        const response = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        return await response;
    } catch (error) {
        console.error(error);
        loginUserData.username = "";
        loginUserData.password = "";
    }
}

async function getUserData(data) {
    try {
        const response = await fetch(`http://localhost:8080/api/users/username/${data.username}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${btoa(data.username + ":" + data.password)}`
            },
        });
        return await response;
    } catch (error) {
        console.error(error);
    }
}

function validateLoggedUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user !== null) {
        loginNav.textContent = "Gestionar Usuario";
        loginNav.setAttribute('href', 'contacts.html');
        loginNav.classList.add('btn-info');
        const botonLogOut = document.createElement('button');
        botonLogOut.classList.add('btn', 'btn-danger');
        botonLogOut.textContent = "Cerrar Sesión";
        botonLogOut.setAttribute('id', 'btnLogOut');
        botonLogOut.addEventListener('click', () => {
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
        navcol.appendChild(botonLogOut);

        if (navList) {
            if (user.role === "ROLE_ADMIN") {
                const botonNav = document.createElement('li');
                botonNav.classList.add('nav-item');
                const linkItem = document.createElement('a');
                linkItem.classList.add('nav-link');
                linkItem.textContent = "Gestionar Tienda";
                linkItem.setAttribute('href', 'controlPanel.html');
                botonNav.appendChild(linkItem);
                navList.appendChild(botonNav);
            }
        } else {
            console.error("navList element not found.");
        }
    }
}

function loadLoggedUserData() {
    if (document.querySelector('#nameLogged') === null) {
        return;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    if (user !== null) {
        try {
            document.querySelector('#nameLogged').value = user.fullName;
            document.querySelector('#usernameLogged').value = user.username;
            document.querySelector('#emailLogged').value = user.mail;
            document.querySelector('#genderLogged').value = user.gender;
            document.querySelector('#birthDateLogged').value = user.birthDate;
            document.querySelector('#numberLogged').value = user.phoneNumber;
            document.querySelector('#addressLogged').value = user.address;
        } catch (error) {
            console.error(error);
        }
    }
}

function validateData(e) {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));

    const editForm = document.querySelector('#formLogged');

    const name = document.querySelector('#nameLogged');
    const username = document.querySelector('#usernameLogged');
    const email = document.querySelector('#emailLogged');
    const gender = document.querySelector('#genderLogged');
    const birthDate = document.querySelector('#birthDateLogged');
    const number = document.querySelector('#numberLogged');
    const address = document.querySelector('#addressLogged');

    if (name.value === "" || username.value === "" || email.value === "" || gender.value === "" || birthDate.value === "" || number.value === "" || address.value === "") {
        const alert = document.createElement('div');
        alert.classList.add('alert', 'alert-danger', 'text-center');
        alert.textContent = "Todos los campos son obligatorios";
        alert.style.marginTop = "10px";
        document.querySelector('#formLogged').appendChild(alert);
        setTimeout(() => {
            alert.remove();
        }, 2000);
    } else {
        loggedUser.id = user.id;
        loggedUser.fullName = name.value;
        loggedUser.username = username.value;
        if (!email.value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)) {
            ui.showMessage("El email no es válido", "danger", editForm);
            return;
        }
        loggedUser.mail = email.value;
        if (gender.value === "M" || gender.value === "F") {
            loggedUser.gender = gender.value;
        } else {
            ui.showMessage("El género debe ser M o F", "danger", editForm);
            return;
        }
        loggedUser.birthDate = birthDate.value;
        if (isNaN(number.value)) {
            ui.showMessage("El número de teléfono deben ser solo numeros", "danger", editForm);
            return;
        }
        loggedUser.phoneNumber = number.value;
        loggedUser.address = address.value;
        loggedUser.role = user.role;

        // Show the modal
        const dialogBoxElement = document.getElementById('dialogBox');
        new bootstrap.Modal(dialogBoxElement).show();
    }
}

function saveNewData(e) {
    e.preventDefault();
    getCredentials(e);
        updateUserData(loggedUser, loginUserData).then(response => {
            if (response.status === 200) {
                localStorage.setItem('user', JSON.stringify(loggedUser));
                const alert = document.createElement('div');
                alert.classList.add('alert', 'alert-success', 'text-center');
                alert.textContent = "Datos actualizados correctamente";
                document.querySelector('#formLogged').appendChild(alert);
                setTimeout(() => {
                    alert.remove();
                    window.location.href = 'index.html';
                }, 3000);
            } else {
                const alert = document.createElement('div');
                alert.classList.add('alert', 'alert-danger', 'text-center');
                alert.textContent = "Error al actualizar los datos";
                document.querySelector('#formLogged').appendChild(alert);
                setTimeout(() => {
                    alert.remove();
                }, 2000);
            }
        });
}

function getCredentials() {
    const dialogBox = document.querySelector('#dialogBox');
    const inputUsername = document.querySelector('#usernameDialog');
    const inputPassword = document.querySelector('#passwordDialog');
    loginUserData.username = inputUsername.value;
    loginUserData.password = inputPassword.value;
    loginUserAsync(loginUserData).then(
        response => {
            if (response.status === 200) {
                // Close the modal
                dialogBox.classList.remove('show');
                dialogBox.setAttribute('aria-hidden', 'true');
                document.body.classList.remove('modal-open');
                const modalBackdrop = document.querySelector('.modal-backdrop');
                modalBackdrop.parentNode.removeChild(modalBackdrop);
            } else {
                const alert = document.createElement('div');
                alert.classList.add('alert', 'alert-danger', 'text-center');
                alert.textContent = "Usuario o contraseña incorrectos";
                document.querySelector('#dialogForm').appendChild(alert);
                setTimeout(() => {
                    alert.remove();
                }, 5000);
            }
        }
    );
}

async function updateUserData(newData, oldData) {
    try {
        console.log("Estos son los credenciales: " + oldData.username + " " + oldData.password);
        const response = await fetch(`http://localhost:8080/api/users/${newData.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${btoa(oldData.username + ":" + oldData.password)}`
            },
            body: JSON.stringify(newData)
        });
        console.log(response);
        return await response;
    } catch (error) {
        console.error(error);
    }
}