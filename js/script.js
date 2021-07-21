// funções para ler, editar e remover itens, e apagar a lista inteira do local storage:

// função que lê um item do local storage
function lerLocalStorage(item) { 
    var itemLido = localStorage.getItem(item)
    itemLido = JSON.parse(itemLido)
    return itemLido
}

// função que verifica se a tarefa já está na lista
function verificaTarefa(lista, tarefa) {
    for (i=0; i<lista.length; i++) {
        tarefaLista = lista[i]
        if (tarefaLista["Tarefa"].toLowerCase() == tarefa.value.toLowerCase()) {
            alert("Esta tarefa já está na lista de afazeres.")
            tarefa.value = ''
            tarefa.focus()
            return false
        }
    }
    return true
}

// função que altera o status da tarefa na lista do local storage
function alterarLista(status, texto) {
    // ler a lista do local storage
    var lista = lerLocalStorage("listaTarefas")
    // criar uma lista auxiliar
    var novaLista = []
    // percorrer a lista original
    for (i=0; i<lista.length; i++) {
        tarefa = lista[i]
        // se for a tarefa clicada, alterar o status e coloca na lista auxiliar; senão adiciona como está
        if (texto == tarefa["Tarefa"]) {
            tarefa["Status"] = status
            novaLista.push(tarefa)
        } else {
            novaLista.push(tarefa)
        }
    }
    // armazenando a nova lista
    localStorage.setItem("listaTarefas", JSON.stringify(novaLista))
}

// função que adiciona uma tarefa na lista do local storage e imprime a lista na página
function adicionarTarefa() {
    // ler a lista de tarefas do local storage
    lista = lerLocalStorage("listaTarefas")
    // armazenando a tarefa digitada em uma variável 
    var campoTarefa = document.getElementById("inputTarefa")
    
    if (campoTarefa.value) {
        // verifica se a tarefa já existe na lista
        if (verificaTarefa(lista, campoTarefa)) {
            // armazenando a tarefa na lista do local storage
            var tarefa = {
                "Tarefa": campoTarefa.value,
                "Status": "to-do"
            }
            lista.push(tarefa)
            localStorage.setItem("listaTarefas", JSON.stringify(lista))
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
    var idSelecionado = this.getAttribute("id") // o id selecionado vai ser "lixeira" + um número
    var id = idSelecionado.slice(7) // variavel id vai ser só o número
    // selecionar a tarefa (label) correspondente
    var labelSelecionado = document.getElementById("tarefa" + id)
    // confirmar exclusão de tarefa
    var excluir = confirm("Deseja excluir a tarefa \"" + labelSelecionado.innerText + "\"?")
    if (excluir) {
        // ler a lista de tarefas do local storage
        var lista = lerLocalStorage("listaTarefas")
        // percorrer a lista e procurar a tarefa
        for (i=0; i<lista.length; i++) {
            tarefa = lista[i]
            if (tarefa["Tarefa"] == labelSelecionado.innerText) {
                // remover a tarefa do local storage
                lista.splice(i,1)
            }
        }
        // armazenando a nova lista no local storage
        localStorage.setItem("listaTarefas", JSON.stringify(lista))
        // imprimindo a lista na tela
        listarTarefas()
    }
}

// função que apaga a lista do local storage
function resetarLista() {
    var excluir = confirm("Deseja apagar toda a lista?")

    if (excluir) {
        // apaga a lista do local storage, listaTarefas = []
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

// cada vez que for adicionado ou removido um item da lista, 
// a lista vai ser apagada da página e adicionada novamente

// função que apaga todos os filhos de um nó da página
function apagarFilhos(node_id) {
    var node = document.getElementById(node_id)
    while (node.firstChild) {
        node.removeChild(node.firstChild)
    }
}

// função que monta a lista na página, a partir da lista do local storage
function listarTarefas() {
    // apagar a lista da página
    apagarFilhos("divLista")

    // ler a lista de tarefas do local storage
    lista = lerLocalStorage("listaTarefas")
    // adicionar a lista na página novamente
    var divLista = document.getElementById("divLista")
    for (i=0; i<lista.length; i++) {
        // lendo a tarefa 
        var tarefa = lista[i]
        // criando o ícone de lixeira para remover a tarefa
        criarLixeira(i)
        // criando o checkbox da tarefa
        criarCheckbox(i, tarefa)
        // criando o label da tarefa
        criarLabel(i, tarefa)
        // adicionando uma quebra de linha
        var br = document.createElement("br")
        divLista.appendChild(br)
    }
}

// função que cria o checkbox da tarefa na página
function criarCheckbox(i, tarefa) {
    var inputCheck = document.createElement("input")
    inputCheck.setAttribute("type", "checkbox")
    inputCheck.setAttribute("id", "checkbox" + i)
    inputCheck.setAttribute("class", "checkbox")
    inputCheck.setAttribute("title", "Clique para marcar a tarefa como feita")
    // caso a tarefa esteja feita, deixa o checkbox checado e muda o title
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
    idSelecionado = this.getAttribute("id") // o id vai ser "checkbox" + um número
    var i = idSelecionado.slice(8) // variável i vai ser só o número
    // selecionando o label/tarefa correspondente ao checkbox clicado
    var tarefaSelecionada = document.getElementById("tarefa" + i)
    // obtendo o texto do label
    var texto = tarefaSelecionada.innerText
    // alterando a classe do label/tarefa e a lista no local storage
    if(this.checked) {
        tarefaSelecionada.setAttribute("class", "done")
        alterarLista("done", texto)
    } else {
        tarefaSelecionada.setAttribute("class", "to-do")
        alterarLista("to-do", texto)
    }
}

// função que cria o ícone de lixeira para cada tarefa na página
function criarLixeira(i) {
    var lixeira = document.createElement("img")
    lixeira.setAttribute("id", "lixeira" + i)
    lixeira.setAttribute("class", "lixeira")
    lixeira.setAttribute("title", "Remover tarefa")
    lixeira.setAttribute("src", "img/trash.png")
    divLista.appendChild(lixeira)
    // criando o event listener no botao de remover
    lixeira.addEventListener('click', apagarItem)
}

// função que cria o label da tarefa na página
function criarLabel(i, tarefa) {
    var labelCheck = document.createElement("label")
    labelCheck.setAttribute("for", "checkbox" + i)
    labelCheck.setAttribute("id", "tarefa" + i)
    labelCheck.setAttribute("class", tarefa["Status"])
    labelCheck.innerText = tarefa["Tarefa"]        
    divLista.appendChild(labelCheck)    
}



