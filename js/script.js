// funções para ler, editar e apagar a lista do local storage:

// função que lê um item do local storage
function lerLocalStorage(item) { 
    var itemLido = localStorage.getItem(item)
    itemLido = JSON.parse(itemLido)
    return itemLido
}

// função que altera o status da tarefa na lista do local storage
function alterarLista(lista, status, texto) {
    // ler a lista do local storage
    var listaLS = lerLocalStorage(lista)
    // criar uma lista auxiliar
    var novaLista = []
    // percorrer a lista original
    for (i=0; i<listaLS.length; i++) {
        tarefa = listaLS[i]
        // se for a tarefa clicada, alterar o status
        if (texto == tarefa["Tarefa"]) {
            tarefa["Status"] = status
            novaLista.push(tarefa)
        } else {
            novaLista.push(tarefa)
        }
    }
    // armazenando a nova lista
    localStorage.setItem(lista, JSON.stringify(novaLista))
}

// função que adiciona uma tarefa na lista do local storage e atualiza a lista no dom
function adicionarTarefa() {
    // ler a lista de tarefas do local storage
    listaTarefas = lerLocalStorage("listaTarefas")
    // armazenando a tarefa digitada em uma variável 
    var campoTarefa = document.getElementById("inputTarefa")
    
    if (campoTarefa.value) {
        // verifica se a tarefa já existe na lista
        if (verificaTarefa(listaTarefas, campoTarefa)) {
            // armazenando a tarefa na lista do local storage
            var tarefa = {
                "Tarefa": campoTarefa.value,
                "Status": "to-do"
            }
            listaTarefas.push(tarefa)
            localStorage.setItem("listaTarefas", JSON.stringify(listaTarefas))
            // imprimindo a lista na tela
            listarTarefas()
            // limpando o campo de entrada
            campoTarefa.value = ''
            campoTarefa.focus()
        }
    } else {
        // caso o usuário não digite nada, exibe um alerta
        alert("Por favor digite uma tarefa")
    }
}

// função que apaga a tarefa da lista
function apagarItem() {
    // identificando a tarefa clicada
    idSelecionado = this.getAttribute("id")
    var labelSelecionado = document.querySelector("label#" + idSelecionado)

    var excluir = confirm("Deseja excluir a tarefa \"" + labelSelecionado.innerText + "\"?")

    if (excluir) {
        // ler a lista de tarefas do local storage
        lerLocalStorage("listaTarefas")
        // percorrer a lista e procurar a tarefa
        for (i=0; i<listaTarefas.length; i++) {
            tarefa = listaTarefas[i]
            if (tarefa["Tarefa"]==labelSelecionado.innerText) {
                // remover a tarefa do local storage
                listaTarefas.splice(i,1)
            }
        }
        // armazenando a nova lista no local storage
        localStorage.setItem("listaTarefas", JSON.stringify(listaTarefas))
        // imprimindo a lista na tela
        listarTarefas()
    }
}

// função que apaga a lista do local storage
function resetarLista() {
    var excluir = confirm("Deseja apagar toda a lista?")

    if (excluir) {
        localStorage.setItem("listaTarefas", JSON.stringify([]))
        // apagar a lista da página
        var node = document.getElementById("divLista")
        while (node.firstChild) {
            node.removeChild(node.firstChild)
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////

// funções que manipulam a página

// função que apaga todos os filhos de um nó da página
function apagarFilhos(node_id) {
    var node = document.getElementById(node_id)
    while (node.firstChild) {
        node.removeChild(node.firstChild)
    }
}

// função que monta a lista na página, a partir da lista do local storage
function listarTarefas() {
    // ler a lista de tarefas do local storage
    listaTarefas = lerLocalStorage("listaTarefas")
    // apagar a lista da página
    apagarFilhos("divLista")
    // imprimir a lista novamente
    var divLista = document.getElementById("divLista")
    for (i=0; i<listaTarefas.length; i++) {
        // lendo a tarefa e criando id 
        var tarefa = listaTarefas[i]
        //console.log(tarefa)
        var id = "t" + i
        // criando um botão para remover a tarefa
        criarBotao(id)
        // criando o checkbox da tarefa
        criarCheckbox(id, tarefa)
        // criando o label da tarefa
        criarLabel(id, tarefa)
        // adicionando uma quebra de linha
        var br = document.createElement("br")
        divLista.appendChild(br)
    }
}

// função que cria o checkbox da tarefa na página
function criarCheckbox(id, tarefa) {
    var inputCheck = document.createElement("input")
    inputCheck.setAttribute("type", "checkbox")
    inputCheck.setAttribute("id", id)
    inputCheck.setAttribute("name", id)
    inputCheck.setAttribute("class", "tarefa")
    inputCheck.setAttribute("title", "Clique para marcar a tarefa como feita")
    if (tarefa["Status"] == "done") {
        inputCheck.setAttribute("checked", true)
        inputCheck.setAttribute("title", "Clique para marcar a tarefa como não feita")
    }
    divLista.appendChild(inputCheck)
    // criando o event listener do checkbox
    inputCheck.addEventListener('change', statusTarefa)
}

// função que altera o status da tarefa na página e no local storage (chamando "alterarLista")
function statusTarefa() {
    // obtendo o id do checkbox clicado
    idSelecionado = this.getAttribute("id")
    // selecionando o label/tarefa correspondente ao checkbox clicado
    var tarefaSelecionada = document.querySelector("label#" + idSelecionado)
    // obtendo o texto do label
    var texto = tarefaSelecionada.innerText
    // alterando a classe do label/tarefa e a lista no local storage
    if(this.checked) {
        alterarLista("listaTarefas", "done", texto)
        tarefaSelecionada.setAttribute("class", "done")
    } else {
        alterarLista("listaTarefas","to-do", texto)
        tarefaSelecionada.setAttribute("class", "to-do")
    }
}

// função que cria o botão de remover para cada tarefa na página
function criarBotao(id) {
    var botaoRemover = document.createElement("img")
    botaoRemover.setAttribute("id", id)
    botaoRemover.setAttribute("name", id)
    botaoRemover.setAttribute("class", "remover")
    botaoRemover.setAttribute("title", "Remover tarefa")
    botaoRemover.setAttribute("src", "img/trash.png")
    divLista.appendChild(botaoRemover)
    // criando o event listener no botao de remover
    botaoRemover.addEventListener('click', apagarItem)
}

// função que cria o label da tarefa na página
function criarLabel(id, tarefa) {
    var labelCheck = document.createElement("label")
    labelCheck.setAttribute("for", id)
    labelCheck.setAttribute("name", id)
    labelCheck.setAttribute("id", id)
    labelCheck.setAttribute("class", tarefa["Status"])
    labelCheck.innerText = tarefa["Tarefa"]        
    divLista.appendChild(labelCheck)    
}

// função que verifica se a tarefa já está na lista
function verificaTarefa(lista, tarefa) {
    for (i=0; i<lista.length; i++) {
        tarefaLista = lista[i]
        if (tarefaLista["Tarefa"].toLowerCase()==tarefa.value.toLowerCase()) {
            alert("Esta tarefa já está na lista de afazeres.")
            tarefa.value = ''
            tarefa.focus()
            return false
        }
    }
    return true
}



// TO DO: ITEM REMOVE E PADRONIZAR ARGUMENTOS DAS FUNCOES (VER SE PRECISA FICAR LENDO A LISTA DENTRO DAS FUNCOES)