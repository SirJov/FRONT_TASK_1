//________________GET________________
//DIV que vai receber os dados
const containerTask = document.querySelector("#contain");

//Funçao que faz a consulta tipo GET na API
async function consultaTask() {
  const retorno = await fetch("http://localhost:3000/api/tasks/listar");
  const tarefasRetornadas = await retorno.json();
  preencheInfoNoHtml(tarefasRetornadas);
}

//Funçao que adiciona os dados no HTML
function preencheInfoNoHtml(tarefasRetornadas) {
  //loop Para adicionar cada item informado pela API nas devidas tags HTML
  tarefasRetornadas.forEach((cadaTarefa) => {
    const infoEstado = alteraCLass(cadaTarefa.estado);
    const tarefasNoHtml = `
    <div class="cards" id="${infoEstado[3]}"> 
      <div>
        <h3 id="texto">
          ${cadaTarefa.tarefa}
        </h3>
        <p class="${infoEstado[1]}">${cadaTarefa.estado}</p>
      </div>
      <div>
        <button class="botaoDeletar" onclick="deletarTask(${cadaTarefa.id})">X</button>
        <button id="btnAlter" class="${infoEstado[0]}" onclick="atualizaTask(${cadaTarefa.id})"  value="${cadaTarefa.estado}">${infoEstado[2]}</button>
      </div>
    </div>`;
    containerTask.innerHTML = containerTask.innerHTML + tarefasNoHtml;
  });
}

consultaTask();
//________________Verifica Estado e altera Class________________

function alteraCLass(estado) {
  if (estado === "PENDENTE") {
    const sta = ["botaoConcluir", "penden", "✓", "tipA"];
    return sta;
  }
  if (estado === "CONCLUIDO") {
    const sta = ["botaoResetar", "conclu", "↺", "tipB"];
    return sta;
  }
}

//________________POST________________

const btnSalvar = document.querySelector("#botaoSalvar");

//Evento do botao onde ele envia os dados para a API
btnSalvar.addEventListener("click", () => {
  const dadosTask = getDadosForm();
  enviarTarefa(dadosTask);
});

//funçao que captura os dados do formulario
function getDadosForm() {
  const inputTask = document.querySelector("#novaTarefa");
  if (inputTask.value === null || inputTask.value.length === 0) {
    alert("Campo tarefa vasio!!");
    return;
  }
  if (inputTask.value.length > 45) {
    alert("O maximo de caracteres é 45!!");
    return;
  }
  const novaTarefa = {
    tarefa: inputTask.value,
  };
  return novaTarefa;
}

async function enviarTarefa(novaTarefa) {
  try {
    const resposta = await fetch("http://localhost:3000/api/tasks/criar", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novaTarefa),
    });
    if (resposta.status === 200) {
      limparCampos();
    } else {
      console.log("erro ao adicionar Tarefa");
    }
  } catch (error) {
    console.error(error);
  }
}

function limparCampos() {
  document.querySelector("#novaTarefa").value = "";
}

//________________DELETE________________

async function deletarTask(id) {
  await fetch(`http://localhost:3000/api/tasks/deletar/${id}`, {
    method: "DELETE",
  });
  window.location.reload(true);
}

//________________MUDAR ESTADO________________

async function atualizaTask(id) {
  await fetch(`http://localhost:3000/api/tasks/atualizar/${id}`, {
    method: "PUT",
  });
  window.location.reload(true);
}

//_______COR VERMELHO/VERDE_______
const botaoAtualizar = document.getElementsByClassName(".botaoConcluir");
