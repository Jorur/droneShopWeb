const inputUser = document.querySelector('#inputUsername');
const inputPass = document.querySelector('#inputPassword');
const btnLogin = document.querySelector('#btnLogin');

const loginNav = document.querySelector('#loginBtnNav');
const navList = document.querySelector('#navList');
const navcol = document.querySelector('#navcol-1');

const loginUserData = {
    username: "",
    password: ""
}

const loggedUser = {
    id: 0,
    fullName: "",
    username: "",
    mail: "",
    password: "",
    gender: "",
    birthDate: "",
    phoneNumber: 0,
    role: "",
    address: ""
}

//Function
eventListeners();

function eventListeners() {
    if (btnLogin){
        btnLogin.addEventListener('click', loginUser);
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
    console.log(loginUserData);
    loginUserAsync(loginUserData).then(
        responseAuth => {
            getUserData(loginUserData).then(responseUserData => {
                if (responseAuth.status === 200) {
                    responseUserData.json().then(data => {
                        loggedUser.id = data.id;
                        loggedUser.fullName = data.fullName;
                        loggedUser.username = data.username;
                        loggedUser.mail = data.mail;
                        loggedUser.password = data.password;
                        loggedUser.gender = data.gender;
                        loggedUser.birthDate = data.birthDate;
                        loggedUser.phoneNumber = data.phoneNumber;
                        loggedUser.role = data.role;
                        loggedUser.address = data.address;
                        localStorage.setItem('user', JSON.stringify(loggedUser));
                        loadLoggedUserData();
                    });
                    window.location.href = 'index.html';
                }

                else{
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
            if (user.role === "ROLE_ADMIN"){
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
    console.log(user);
    if (user !== null) {
        try{
            document.querySelector('#nameLogged').value = user.fullName;
            document.querySelector('#emailLogged').value = user.mail;
            document.querySelector('#numberLogged').value = user.phoneNumber;
            document.querySelector('#addressLogged').value = user.address;
        } catch (error) {
            console.error(error);
        }
    }
}