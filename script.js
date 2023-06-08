let nameHero, surnameHero, fantasy, locale, idEdicao;

const formulario = document.querySelector(".form");
const inputNome = document.getElementById("nome");
const inputSobrenome = document.getElementById("sobrenome");
const inputFantasia = document.getElementById("fantasia");
const inputLocal = document.getElementById("local");
const botao = document.getElementById("botao");
let urlPadrao = "http://localhost:5202/api/Personagens";

function addNome() {
  nameHero = inputNome.value;
  nameHero = nameHero[0].toUpperCase() + nameHero.substring(1).toLowerCase();
  console.log(nameHero);
}

function addSobrenome() {
  surnameHero = inputSobrenome.value;
  surnameHero =
    surnameHero[0].toUpperCase() + surnameHero.substring(1).toLowerCase();
  console.log(surnameHero);
}

function addFantasia() {
  fantasy = inputFantasia.value;
  fantasy = fantasy[0].toUpperCase() + fantasy.substring(1).toLowerCase();
  console.log(fantasy);
}

function addLocal() {
  locale = inputLocal.value;
  locale = locale[0].toUpperCase() + locale.substring(1).toLowerCase();
  console.log(locale);
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (botao.innerHTML.toString() == "Cadastrar") {
    registrar();
  } else {
    editando();
  }
});
const fetchRPG = async (id) => {
  const url = !id  || id  == 0 ? urlPadrao : `${urlPadrao}/${id}`;
  const APIresponse = await fetch(url);
  if (APIresponse.status === 200) {
    const dados = await APIresponse.json();
    return dados;
  }
};

const buscaHerois = async (id) => {
  const dados = await fetchRPG(id);
  if (dados) reendeniza(dados);
};

const registrar = async () => {
  let dadosFinais = {
    id: 0,
    nome: nameHero.toString(),
    sobrenome: surnameHero.toString(),
    fantasia: fantasy.toString(),
    local: locale.toString(),
  };

  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dadosFinais),
  };

  await fetch(urlPadrao, options)
    .then((resp) => {
      return resp.json();
    })
    .then((dados) => {
      reendeniza(dados);
    })
    .catch((error) => {
      alert(error.toString());
    })
    .finally(() => {
      formulario.reset();
    });
};
const edicao = async (id) => {
  const dados = await fetchRPG(id);
  inputNome.value = dados.nome;
  inputSobrenome.value = dados.sobrenome;
  inputFantasia.value = dados.fantasia;
  inputLocal.value = dados.local;
  idEdicao = dados.id;

  botao.innerText = "Editar";
};

const editando = async () => {
  let dadosFinais = {
    id: 0,
    nome: inputNome.value.toString(),
    sobrenome: inputSobrenome.value.toString(),
    fantasia: inputFantasia.value.toString(),
    local: inputLocal.value.toString(),
  };

  let options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dadosFinais),
  };

  await fetch(urlPadrao + "/" + idEdicao, options)
    .then((resp) => {
      if (resp.ok) {
        buscaHerois();
      }
    })
    .catch((e) => {
      alert("Erro de pecinha" + e);
    })
    .finally(() =>{
      formulario.reset()
      botao.innerHTML = "Cadastrar";
    })
};

const exclusao = async (id) => {
  let options = {
    method: "DELETE",
  };
  await fetch(urlPadrao + "/" + id, options)
    .then((resp) => {
      return resp.json();
    })
    .then((dados) => {
      reendeniza(dados);
      console.log(dados);
    })
    .catch(() => {
      alert("Não foi possível excluir");
    });
};

const reendeniza = (dados) => {
  if (!dados || dados.length == 0) {
    const div = document.getElementById("tabela");

    if (div) {
      div.style.display = "none";
    }
  } else {
    const div = document.getElementById("tabela");

    if (div) {
      div.style.display = "block";
    }

    let table = document.getElementById("tabelaHerois");

    while (table.firstChild) {
      table.removeChild(table.firstChild);
    }
    let tituloLinha = document.createElement("tr");

    let titulo1 = document.createElement("th");
    titulo1.textContent = "Nome";

    let titulo2 = document.createElement("th");
    titulo2.textContent = "Sobrenome";

    let titulo3 = document.createElement("th");
    titulo3.textContent = "Fantasia";

    let titulo4 = document.createElement("th");
    titulo4.textContent = "Local";

    let titulo5 = document.createElement("th");
    titulo5.textContent = "Editar";

    let titulo6 = document.createElement("th");
    titulo6.textContent = "Excluir";

    tituloLinha.appendChild(titulo1);
    tituloLinha.appendChild(titulo2);
    tituloLinha.appendChild(titulo3);
    tituloLinha.appendChild(titulo4);
    tituloLinha.appendChild(titulo5);
    tituloLinha.appendChild(titulo6);

    table.appendChild(tituloLinha);

    dados.forEach((heroi) => {
      let dadosLinha = document.createElement("tr");

      let dados1 = document.createElement("td");
      dados1.textContent = heroi.nome;
      

      let dados2 = document.createElement("td");
      dados2.textContent = heroi.sobrenome;

      let dados3 = document.createElement("td");
      dados3.textContent = heroi.fantasia;

      let dados4 = document.createElement("td");
      dados4.textContent = heroi.local;

      let editar = document.createElement("img");

      editar.onclick = function () {
        edicao(heroi.id);
      };

      let excluir = document.createElement("img");

      excluir.onclick = function () {
        // alert("Excluindo o herói de id " + heroi.id);
        exclusao(heroi.id);
      };

      editar.src = "Img/editar.png";
      excluir.src = "Img/lixeira-de-reciclagem.png";

      let dados5 = document.createElement("td");
      dados5.appendChild(editar);

      let dados6 = document.createElement("td");
      dados6.appendChild(excluir);

      dadosLinha.appendChild(dados1);
      dadosLinha.appendChild(dados2);
      dadosLinha.appendChild(dados3);
      dadosLinha.appendChild(dados4);
      dadosLinha.appendChild(dados5);
      dadosLinha.appendChild(dados6);

      table.appendChild(dadosLinha);
    });
  }
};

buscaHerois();
