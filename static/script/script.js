function popUp() {
    let popUpWindow = document.getElementById('popup');
    let popUpClose = document.getElementsByClassName("close");
    let tableBody = document.getElementById('table-body');
    if (popUpWindow.style.display === "block") {
        popUpWindow.style.display = "none";
    }
    popUpWindow.style.display = "block";

    for (let i = 0; i < popUpClose.length; i++) {
        popUpClose[i].addEventListener("click", function () {
            tableBody.innerHTML = "";
            popUpWindow.style.display = "none";
        })
    }

    window.onclick = function (e) {
        if (e.target === popUpWindow) {
            tableBody.innerHTML = "";
            popUpWindow.style.display = "none";
        }
    }
}


function getDatabyRequest(urlPlanet) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", urlPlanet);
        xhr.onload = function () {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                resolve(data);
            } else {
                reject(console.log("We connected to the server, but it returned an error"));
            }
        };
        xhr.send();
    });
}


function getLinkResidents(data) {
    return data['residents'];
}


function getDataResidents(data) {
    let urls = data;
    let dataResidents = [];
    for (let i = 0; i < data.length; i++) {
        getDatabyRequest(data[i])
            .then(renderResidentsWindow);
    }
}


function renderResidentsWindow(data) {
    let popupTable = document.getElementById('table-body');
    let newRow = `<tr><td>${data.name} </td>
            <td>${data.height}</td>
            <td>${data.mass}</td>
            <td>${data.hair_color}</td>
            <td>${data.skin_color}</td>
            <td>${data.eye_color}</td>
            <td>${data.birth_year}</td>
            <td>${formateDataGender(data.gender)}</td>`;
    popupTable.insertAdjacentHTML('beforeend', newRow);
}


function displayNamePlanetIntoResidentsWindow(btn) {
    let namePlanet = btn.closest('tr').firstElementChild.textContent;
    let popupHeader = document.getElementById('popup-header');
    popupHeader.textContent = `Residents of ${namePlanet}`;
    return btn.parentElement.getAttribute('url_pl');
}


function addListenerButtonResident() {
    let btnArr = document.getElementsByClassName('resident');
    for (let btn of btnArr) {
        btn.addEventListener("click", function handler() {
            popUp();
            let urlPlanet = displayNamePlanetIntoResidentsWindow(btn);
            getDatabyRequest(urlPlanet)
                .then(getLinkResidents)
                .then(getDataResidents);
        });
    }
}


function formateDataGender(gender) {
    switch (gender) {
        case 'male':
            gender = '<i class="fas fa-mars"></i>';
            break;
        case 'female':
            gender = '<i class="fas fa-venus"></i>';
            break;
        case 'n/a':
            gender = '<i class="fas fa-genderless"></i>';
            break;
        default:
            gender = 'unknown';

    }
    return gender
}


function formateDataDiameter() {
    let arrData = document.getElementsByClassName('diameter');
    for (let i = 1; i < arrData.length; i++) {
        let text = arrData[i].textContent;
        if (text !== "unknown") {
            text = text.replace(/(\w+)(\w{3})/, "$1,$2 km");
            arrData[i].textContent = text;
        }
    }
}


function formateDataPopulation() {
    let arrData = document.getElementsByClassName('population');
    for (let i = 1; i < arrData.length; i++) {
        let text = arrData[i].textContent;
        if (text !== "unknown") {
            text = text.replace(/(\d)(?=(\d{3})+([^\d]|$))/g, "$1,") + " people";
            arrData[i].textContent = text;
        }
    }
}


function formateDataSurface() {
    let arrData = document.getElementsByClassName('surface_water');
    for (let i = 1; i < arrData.length; i++) {
        let text = arrData[i].textContent;
        if (text !== "unknown") {
            text = text + "%";
            arrData[i].textContent = text;
        }
    }
}


function formateDataResidents() {
    let arrData = document.getElementsByClassName('residents');
    for (let i = 1; i < arrData.length; i++) {
        let text = arrData[i].textContent;
        if (text === "") {
            text = "No known residents";
            arrData[i].textContent = text;
        } else {
            let arrText = text.split(',');
            let count = arrText.length;
            arrData[i].textContent = count;
            arrData[i].innerHTML = `<button id="r${i}" type="button" class="btn btn-outline-secondary resident">${count} resident(s)</button>`;
        }
    }
}

function addListenerPaginator() {
    let paginationBtnArr = document.querySelectorAll('.btn-paginator');
    for (let pagBtn of paginationBtnArr) {
        pagBtn.addEventListener('click', function () {
            let url = pagBtn.dataset.url;
            getDataByRequestToIndexPage(url)
                .then(renderTablePlanets)
                .then(addListenerButtonResident);

        })
    }
}


function addPaginatorButtons(data) {
    let previousLink = data.previous;
    let nextLink = data.next;
    let prevBtn = document.getElementById('prev-link');
    prevBtn.setAttribute('data-url', previousLink);
    let nextBtn = document.getElementById('next-link');
    nextBtn.setAttribute('data-url', nextLink);
}


function getDataByRequestToIndexPage(url) {
    if (url === undefined) {
        url = 'https://swapi.co/api/planets/?page=1';
    }
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function () {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                resolve(data);
            } else {
                reject(console.log("We connected to the server, but it returned an error"));
            }
        };
        xhr.send();
    });
}

function renderHeaderTablePlanets(headersList) {
    let rowInTable = document.createElement('tr');
    for (let item in headersList) {
        let cellInTable = document.createElement('td');
        cellInTable.classList.add(item);
        cellInTable.innerHTML = headersList[item];
        rowInTable.appendChild(cellInTable);
    }
    return rowInTable
}


function renderBodyTablePlanets(headersList, tablePlanet, results) {
    for (let i = 0; i < results.length; i++) {
        let rowInTable = document.createElement('tr');
        for (let item in headersList) {
            let cellInTable = document.createElement('td');
            cellInTable.classList.add(item);
            if (cellInTable.className === "residents") {
                cellInTable.setAttribute('url_pl', results[i]['url']);
            }
            cellInTable.innerHTML = results[i][item];
            rowInTable.appendChild(cellInTable);
        }
        tablePlanet.appendChild(rowInTable);
    }
    formateDataDiameter();
    formateDataPopulation();
    formateDataSurface();
    formateDataResidents();
}


function renderTablePlanets(data) {
    addPaginatorButtons(data);
    let results = data.results;
    let headersList = {
        "name": "Name",
        "diameter": "Diameter",
        "climate": "Climate",
        "terrain": "Terrain",
        "surface_water": "Surface Water Percentage",
        "population": "Population",
        "residents": "Residents"
    };
    let tablePlanet = document.getElementById("table-planets");
    tablePlanet.innerHTML = "";

    let headerRow = renderHeaderTablePlanets(headersList);
    tablePlanet.appendChild(headerRow);

    renderBodyTablePlanets(headersList, tablePlanet, results)
}


// window.onload = function main() {
//     getDataByRequestToIndexPage()
//         .then(renderTablePlanets)
//         .then(addListenerButtonResident);
//      addListenerPaginator();
//     // renderTablePlanets(data);
//     // addListenerButtonResident();
//     // addPaginatorButtons(data);
// };
