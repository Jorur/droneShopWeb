const inputEmail = document.querySelector('input[type="email"]');
const inputPass = document.querySelector('#inputPassword');
const btnLoginSeller = document.querySelector('#btnLoginSeller');
const btnLoginClient = document.querySelector('#btnLoginClient');
const loginNav = document.querySelector('#loginBtnNav');
const btnConfirmCredentials = document.querySelector('#btnConfirmCredentials');
const saveBtn = document.querySelector('#saveButton');



const loginUserData = {
    email: "",
    password: ""
};
const loggedSeller = {
    id: 0,
    name: "",
    lastname: "",
    email: "",

};
const loggedClient = {
    id: 0,
    name: "",
    lastname: "",
    company: "",
    email: "",
    phone: "",
    seller: ""
}
const sessionToken = {
    token: ""

};
class UI {
    showMessage(message, cssClass, whereToAppend) {
        const alert = document.createElement('div');
        alert.classList.add('alert', `alert-${cssClass}`, 'text-center');
        alert.textContent = message;
        alert.style.marginTop = "10px";
        whereToAppend.appendChild(alert);
        setTimeout(() => {
            alert.remove();
        }, 2000);
    }
}

const ui = new UI();

function eventListeners() {
    if (btnLoginClient) {
        btnLoginClient.addEventListener('click', loginClient);
    }
    if (btnLoginSeller) {
        btnLoginSeller.addEventListener('click', loginSeller);
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

eventListeners();


/*funciones de inicio de sesion*/
async function loginClient(e) {
    e.preventDefault();
    if (inputEmail.value === "" || inputPass.value === "") {
        const alert = document.createElement('div');
        alert.classList.add('alert', 'alert-danger', 'text-center');
        alert.textContent = "Todos los campos son obligatorios";
        document.querySelector('#formLogin').appendChild(alert);
        setTimeout(() => {
            alert.remove();
        }, 2000);
        return;
    }
    loginUserData.email = inputEmail.value;
    loginUserData.password = inputPass.value;
    loginClientAsync(loginUserData).then(
        responseAuth => {
            if (responseAuth && responseAuth.data) {
                sessionToken.token = responseAuth.data.userAuth.token;
                getClientData(sessionToken.token).then(
                    responseAuth => {
                        if (responseAuth && responseAuth.data && responseAuth.data.getClient) {
                            loggedClient.name = responseAuth.data.getClient.name;
                            loggedClient.lastname = responseAuth.data.getClient.lastname;
                            loggedClient.company = responseAuth.data.getClient.company;
                            loggedClient.email = responseAuth.data.getClient.email;
                            loggedClient.phone = responseAuth.data.getClient.phoneNumber;
                            loggedClient.seller = responseAuth.data.getClient.seller;

                            localStorage.setItem('client', JSON.stringify(loggedClient));
                            window.location.href = 'index.html';
                        } else {
                            ui.showMessage("Error al obtener los datos del usuario", "danger", document.querySelector('#formLogin'));
                        }
                    }
                );
            } else {
                ui.showMessage("Usuario o contraseña incorrectos", "danger", document.querySelector('#formLogin'));
            }
        }
    );
}
async function loginSeller(e) {
    e.preventDefault();
    if (inputEmail.value === "" || inputPass.value === "") {
        const alert = document.createElement('div');
        alert.classList.add('alert', 'alert-danger', 'text-center');
        alert.textContent = "Todos los campos son obligatorios";
        document.querySelector('#formLogin').appendChild(alert);
        setTimeout(() => {
            alert.remove();
        }, 2000);
        return;
    }
    loginUserData.email = inputEmail.value;
    loginUserData.password = inputPass.value;
    loginSellerAsync(loginUserData).then(
        responseAuth => {
            if (responseAuth && responseAuth.data) {
                sessionToken.token = responseAuth.data.userAuth.token;
                getSellerData(sessionToken.token).then(
                    responseAuth => {
                        if (responseAuth && responseAuth.data && responseAuth.data.getClient) {
                            loggedSeller.name = responseAuth.data.getSeller.name;
                            loggedSeller.lastname = responseAuth.data.getSeller.lastname;
                            loggedSeller.email = responseAuth.data.getSeller.email;


                            localStorage.setItem('seller', JSON.stringify(loggedSeller));
                            window.location.href = 'index.html';
                        } else {
                            ui.showMessage("Error al obtener los datos del usuario", "danger", document.querySelector('#formLogin'));
                        }
                    }
                );
            } else {
                ui.showMessage("Usuario o contraseña incorrectos", "danger", document.querySelector('#formLogin'));
            }
        }
    );
}
async function loginClientAsync(data) {
        try {
            const response = await fetch('http://localhost:4000/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                 mutation AuthClientLogin($input: clientAuthentication) {
                  authClientLogin(input: $input) {
                    token
                  }
                }
                `,
                    variables: {
                        input: {
                            email: data.email,
                            password: data.password
                        }
                    }
                })
            });

            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }
async function loginSellerAsync(data) {
    try {
        const response = await fetch('http://localhost:4000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                 mutation AuthSellerLogin($input: sellerAuthentication) {
                  authSellerLogin(input: $input) {
                    token
                  }
                }
                `,
                variables: {
                    input: {
                        email: data.email,
                        password: data.password
                    }
                }
            })
        });

        return await response.json();
    } catch (error) {
        console.error(error);
    }
}
async function getClientData(logtoken) {
        try {
            const response = await fetch('http://localhost:4000/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                    query GetClient($token: String) {
                        getClient(token: $token) {
                            id
                            name
                            lastname
                            company
                            email
                            phoneNumber
                            seller
                        }
                    }
                `,
                    variables: {
                        token: logtoken
                    }
                })
            });

            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }
async function getSellerData(logtoken) {
    try {
        const response = await fetch('http://localhost:4000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query GetSeller($token: String) {
                        getSeller(token: $token) {
                            id
                            name
                            lastname
                            email      
                        }
                    }
                `,
                variables: {
                    token: logtoken
                }
            })
        });

        return await response.json();
    } catch (error) {
        console.error(error);
    }
}
function validateLoggedUser() {

    const client = JSON.parse(localStorage.getItem('client'));
    const seller = JSON.parse(localStorage.getItem('seller'));

    if (client === null && seller !== null) {

        const botonNav = document.createElement('li');
        botonNav.classList.add('nav-item');
        const linkItem = document.createElement('a');
        linkItem.classList.add('nav-link');
        linkItem.textContent = "Gestionar Tienda";
        linkItem.setAttribute('href', 'controlPanel.html');
        botonNav.appendChild(linkItem);
        navList.appendChild(botonNav);
    }

    if (client !== null || seller !== null) {

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
    }

    else {
        console.error("navList element not found.");
    }

}
function loadLoggedUserData() {
        if (document.querySelector('#nameLogged') === null) {
            return;
        }
    const client = JSON.parse(localStorage.getItem('client'));
    const seller = JSON.parse(localStorage.getItem('seller'));

    if (client !== null) {
        try {
            document.querySelector('#nameLogged').value = client.name;
            document.querySelector('#lastnameLogged').value = client.lastname;
            document.querySelector('#companyLogged').value = client.company;
            document.querySelector('#emailLogged').value = client.email;
            document.querySelector('#phoneNumber').value = client.phone;
            document.querySelector('#sellerLogged').value = client.seller;
        } catch (error) {
            console.error(error);
        }
    } else if (seller !== null) {
        try {
            document.querySelector('#nameLogged').value = seller.name;
            document.querySelector('#lastnameLogged').value = seller.lastname;
            document.querySelector('#emailLogged').value = seller.email;
        } catch (error) {
            console.error(error);
        }
    }

}
function validateData(e) {
    e.preventDefault();

    const client = JSON.parse(localStorage.getItem('client'));
    const seller = JSON.parse(localStorage.getItem('seller'));

    const editForm = document.querySelector('#formLogged');

    const name = document.querySelector('#nameLogged');
    const lastname = document.querySelector('#lastnameLogged');
    const username = document.querySelector('#usernameLogged');
    const email = document.querySelector('#emailLogged');
    const company = document.querySelector('#companyLogged');
    const phone = document.querySelector('#phoneNumberLogged');
    const sellerField = document.querySelector('#sellerLogged');
    const created = document.querySelector('#createdLogged');
    const password = document.querySelector('#passwordLogged');

    if ((client && seller) || (!client && !seller)) {
        console.error("Error: No se puede determinar si el usuario es cliente o vendedor.");
        return;
    }

    if (client) {
        if (name.value === "" || lastname.value === "" || username.value === "" || email.value === "" || company.value === "" || phone.value === "" || sellerField.value === "" || created.value === "" || password.value === "") {
            const alert = document.createElement('div');
            alert.classList.add('alert', 'alert-danger', 'text-center');
            alert.textContent = "Todos los campos son obligatorios";
            alert.style.marginTop = "10px";
            document.querySelector('#formLogged').appendChild(alert);
            setTimeout(() => {
                alert.remove();
            }, 2000);
        } else {
            loggedUser.id = client.id;
            loggedUser.name = name.value;
            loggedUser.lastname = lastname.value;
            loggedUser.username = username.value;
            loggedUser.email = email.value;
            loggedUser.company = company.value;
            loggedUser.phone = phone.value;
            loggedUser.seller = sellerField.value;
            loggedUser.created = created.value;
            loggedUser.password = password.value;

            // Show the modal
            const dialogBoxElement = document.getElementById('dialogBox');
            new bootstrap.Modal(dialogBoxElement).show();
        }
    } else if (seller) {
        if (name.value === "" || lastname.value === "" || email.value === "" || password.value === "") {
            const alert = document.createElement('div');
            alert.classList.add('alert', 'alert-danger', 'text-center');
            alert.textContent = "Todos los campos son obligatorios";
            alert.style.marginTop = "10px";
            document.querySelector('#formLogged').appendChild(alert);
            setTimeout(() => {
                alert.remove();
            }, 2000);
        } else {
            loggedUser.id = seller.id;
            loggedUser.name = name.value;
            loggedUser.lastname = lastname.value;
            loggedUser.email = email.value;
            loggedUser.password = password.value;

            // Show the modal
            const dialogBoxElement = document.getElementById('dialogBox');
            new bootstrap.Modal(dialogBoxElement).show();
        }
    }
}
function saveNewData(e) {
    e.preventDefault();
    getCredentials();

    if (loggedClient.company !== undefined) { // Usuario es cliente
        updateUserData(loggedClient, loginUserData).then(response => {
            if (response.status === 200) {
                localStorage.setItem('client', JSON.stringify(loggedClient));
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
    } else {
        updateUserData(loggedSeller, loginUserData).then(response => {
            if (response.status === 200) {
                localStorage.setItem('seller', JSON.stringify(loggedSeller));
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
}
function getCredentials() {
        const dialogBox = document.querySelector('#dialogBox');
        const inputEmail = document.querySelector('#usernameDialog');
        const inputPassword = document.querySelector('#passwordDialog');
        loginUserData.email = inputEmail.value;
        loginUserData.password = inputPassword.value;
        loginUserAsync(loginUserData).then(
            response => {
                if (response && response.data && response.data.getUser) {
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
        let mutationQuery = "";
        let variables = {};

        if (newData.company !== undefined) {
            mutationQuery = `
                mutation UpdateClient($id: ID!, $input: ClientInput!) {
                    updateClient(id: $id, input: $input) {
                        id
                        name
                        lastname
                        company
                        email
                        // Agrega los campos adicionales que necesites
                    }
                }
            `;
            variables = {
                id: newData.id,
                input: {
                    name: newData.name,
                    lastname: newData.lastname,
                    company: newData.company,
                    email: newData.email,
                }
            };
        } else {
            mutationQuery = `
                mutation UpdateSeller($id: ID!, $input: SellerInput!) {
                    updateSeller(id: $id, input: $input) {
                        id
                        name
                        lastname
                        email
                    }
                }
            `;
            variables = {
                id: newData.id,
                input: {
                    name: newData.name,
                    lastname: newData.lastname,
                    email: newData.email,
                }
            };
        }

        const response = await fetch('http://localhost:4000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: mutationQuery,
                variables: variables
            })
        });

        console.log(response);
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}


/*funciones de compra (shopping-cart.html)*/


/*funciones de stock (stock.html)*/


/*funciones de team (team.html)*/
