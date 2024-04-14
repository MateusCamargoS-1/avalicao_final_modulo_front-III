const characters = document.getElementById('row-character');
const personagens = document.getElementById('personagens');
const localizacao = document.getElementById('localizacao');
const episodios = document.getElementById('episodio');
const btnProximo = document.getElementById('avanco');
const btnVoltar = document.getElementById('retorno');
const modal = document.getElementById('exampleModal');
const cont = document.getElementById('numCont');
let page = 1;
const limite = 6;
let lista = [];

const getCharacter = () => {
    app.get(`/character?page=${page}`)
        .then(function (res) {
            personagens.innerText = res.data.info.count;
            characters.innerHTML = '';
            const listCharacter = res.data.results.slice(0, 6);
            listCharacter.forEach(character => {
                const col = document.createElement('div');
                col.setAttribute('class', 'col-12 col-md-6');
                characters.appendChild(col);
                getUltimoEpisodio(character, col);
                col.addEventListener('click', function () {
                    exibirModal(character);
                });
            });
            proximaPage(res.data.info.pages);
            atualizarCont();
        })
        .catch(function (err) {
            console.log(err);
        });
}


const getUltimoEpisodio = (character, col) => {
    app.get(character.episode[character.episode.length - 1])
        .then(function (res) {
            const episodeName = res.data.name;
            col.innerHTML = `
                    <div class="card d-flex flex-row" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <img src="${character.image}" class="img-card" alt="..." width="150px"/>
                        <div class="card-body">
                            <h6 class="title-card">
                                ${character.name}
                                <small class="status">
                                    <span class="status-ball" style="background-color: ${mudarCorStatus(character.status)};"></span> ${character.status} - ${character.species}
                                </small>
                            </h6>
                            <p class="local-visto">
                                Última localização conhecida
                                <small class="descricao">${character.location.name}</small>
                            </p>
                            <p class="local-visto">
                                Visto a última vez em:
                                <small class="descricao">${episodeName}</small>
                            </p>
                        </div>
                    </div>`;
        })
        .catch(function (err) {
            console.log(err);
        });
}


const getAllLocation = () => {
    app.get('/location')
        .then(function (res) {
            const allLocation = res.data.info.count;
            localizacao.innerText = allLocation;
        })
        .catch(function (err) {
            console.log(err);
        })
}

const getEpisodes = () => {
    app.get('/episode')
        .then(function (res) {
            const allEpsodes = res.data.info.count;
            episodios.innerText = allEpsodes;
        })
        .catch(function (err) {
            console.log(err);
        })
}


const mudarCorStatus = (status) => {
    switch (status) {
        case "Alive":
            return "#56cd42";
        case "Dead":
            return "#cd4242";
        default:
            return "#bbb";
    }
}

const exibirModal = (data) => {
    const idUltimoEpisodio = data.episode[data.episode.length - 1];
    const sobreLocalizacao = data.location.url;

    app.get(idUltimoEpisodio)
        .then(function (res) {
            let ultimoEpisodio = res.data.name;

            app.get(sobreLocalizacao)
                .then(function (res) {
                    let name = res.data.name;
                    let type = res.data.type;
                    let dimension = res.data.dimension;

                    modal.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">${data.name}</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <img src="${data.image}" alt="Character Image" width="150px">
                            <p style=" display: flex; align-items: center;"><strong>Status:</strong> <span class="status-ball" style="background-color: ${mudarCorStatus(data.status)}; margin-left: 10px;"></span>${data.status}</p>
                            <p><strong>Espécie:</strong> ${data.species}</p>
                            <p class="sobre-localizacao"><strong>Última localização conhecida:</strong> 
                                <span>Nome: ${name}</span>
                                <span>Tipo: ${type}</span>
                                <span>Dimensão: ${dimension}</span>
                            </p>
                            <p><strong>Visto pela última vez em:</strong> ${ultimoEpisodio}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>`;
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
}

const proximo = () => {
    page++;
    getCharacter();
}

const recuo = () => {
    if (page > 1) {
        page--;
        getCharacter();
    }
}

const proximaPage = (totalPages) => {
    if (page === 1) {
        btnVoltar.disabled = true;
        btnVoltar.style.opacity = '0.5'
    } else {
        btnVoltar.disabled = false;
        btnVoltar.style.opacity = '1'
    }

    if (page === totalPages) {
        btnProximo.disabled = true;
        btnProximo.style.opacity = '0.5'
    } else {
        btnProximo.disabled = false;
        btnProximo.style.opacity = '1'
    }
}

const atualizarCont = () => {
    cont.innerText = page;
}

btnProximo.addEventListener('click', proximo);
btnVoltar.addEventListener('click', recuo);

getCharacter();
getAllLocation();
getEpisodes();