// função que monta a lista na página, a partir da lista do local storage
function listarTarefas() {
    // apagar a lista da página
    apagarFilhos("divLista")

    // ler a lista de tarefas do local storage
    let lista = lerLocalStorage("listaTarefas")

    // adicionar a lista na página novamente
    let divLista = document.getElementById("divLista")
    for (let i=0; i<lista.length; i++) {
        // lendo a tarefa 
        let tarefa = lista[i]
        // criando o ícone de lixeira para remover a tarefa
        criarLixeira(i)
        // criando o checkbox da tarefa
        criarCheckbox(i, tarefa)
        // criando o label da tarefa
        criarLabel(i, tarefa)
        // adicionando uma quebra de linha
        let br = document.createElement("br")
        divLista.appendChild(br)
    }
}

// função que apaga todos os filhos de um nó da página
function apagarFilhos(node_id) {
    let node = document.getElementById(node_id)
    while (node.firstChild) {
        node.removeChild(node.firstChild)
    }
}

// função que lê um item do local storage
function lerLocalStorage(item) { 
    let itemLido = localStorage.getItem(item)
    // se não existir lista no local storage, armazenar uma vazia
    if (!itemLido) {
        itemLido = []
        localStorage.setItem("listaTarefas", JSON.stringify(itemLido))
        return itemLido
    }
    itemLido = JSON.parse(itemLido)
    return itemLido
}

// função que cria o ícone de lixeira para cada tarefa na página
function criarLixeira(i) {
    let lixeira = document.createElement("img")
    lixeira.setAttribute("id", "lixeira" + i)
    lixeira.setAttribute("class", "lixeira")
    lixeira.setAttribute("title", "Remover tarefa")
    lixeira.setAttribute("src", "img/trash.png")
    let divLista = document.getElementById("divLista")   
    divLista.appendChild(lixeira)
    // criando o event listener no botao de remover
    lixeira.addEventListener('click', apagarItem)
}

// função que apaga a tarefa da lista
function apagarItem() {
    // identificando a tarefa clicada
    let idSelecionado = this.getAttribute("id") // o id selecionado vai ser "lixeira" + um número
    let id = idSelecionado.slice(7) // variavel id vai ser só o número
    // selecionar a tarefa (label) correspondente
    let labelSelecionado = document.getElementById("tarefa" + id)
    // confirmar exclusão de tarefa
    let excluir = confirm("Deseja excluir a tarefa \"" + labelSelecionado.textContent + "\"?")
    if (excluir) {
        // ler a lista de tarefas do local storage
        let lista = lerLocalStorage("listaTarefas")
        // percorrer a lista e procurar a tarefa
        for (let i=0; i<lista.length; i++) {
            let tarefa = lista[i]
            if (tarefa["Tarefa"] == labelSelecionado.textContent) {
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

// função que cria o checkbox da tarefa na página
function criarCheckbox(i, tarefa) {
    let inputCheck = document.createElement("input")
    inputCheck.setAttribute("type", "checkbox")
    inputCheck.setAttribute("id", "checkbox" + i)
    inputCheck.setAttribute("class", "checkbox")
    inputCheck.setAttribute("title", "Clique para marcar a tarefa como feita")
    // caso a tarefa esteja feita, deixa o checkbox checado e muda o title
    if (tarefa["Status"] == "done") {
        inputCheck.setAttribute("checked", true)
        inputCheck.setAttribute("title", "Clique para marcar a tarefa como não feita")
    }
    let divLista = document.getElementById("divLista")
    divLista.appendChild(inputCheck)
    // criando o event listener do checkbox
    inputCheck.addEventListener('change', statusTarefa)
}

// função que altera o status da tarefa na página e no local storage (chamando "alterarLista")
function statusTarefa() {
    // obtendo o id do checkbox clicado
    let idSelecionado = this.getAttribute("id") // o id vai ser "checkbox" + um número
    let i = idSelecionado.slice(8) // variável i vai ser só o número
    // selecionando o label/tarefa correspondente ao checkbox clicado
    let tarefaSelecionada = document.getElementById("tarefa" + i)
    // obtendo o texto do label
    let texto = tarefaSelecionada.textContent
    // alterando a classe do label/tarefa e a lista no local storage
    if(this.checked) {
        tarefaSelecionada.setAttribute("class", "done")
        alterarLista("done", texto)
    } else {
        tarefaSelecionada.setAttribute("class", "to-do")
        alterarLista("to-do", texto)
    }
}

// função que altera o status da tarefa na lista do local storage
function alterarLista(status, texto) {
    // ler a lista do local storage
    let lista = lerLocalStorage("listaTarefas")
    // criar uma lista auxiliar
    let novaLista = []
    // percorrer a lista original
    for (let i=0; i<lista.length; i++) {
        let tarefa = lista[i]
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

// função que cria o label da tarefa na página
function criarLabel(i, tarefa) {
    let labelCheck = document.createElement("label")
    labelCheck.setAttribute("for", "checkbox" + i)
    labelCheck.setAttribute("id", "tarefa" + i)
    labelCheck.setAttribute("class", tarefa["Status"])
    labelCheck.textContent = tarefa["Tarefa"]
    let divLista = document.getElementById("divLista")   
    divLista.appendChild(labelCheck)    
}

// função que adiciona uma tarefa na lista do local storage e imprime a lista na página
function adicionarTarefa() {
    // ler a lista de tarefas do local storage
    let lista = lerLocalStorage("listaTarefas")
    // armazenando a tarefa digitada em uma variável 
    let campoTarefa = document.getElementById("inputTarefa")

    if (campoTarefa.value.trim()) {
        // verifica se a tarefa já existe na lista
        if (verificaTarefa(lista, campoTarefa)) {
            // armazenando a tarefa na lista do local storage
            let tarefa = {
                "Tarefa": campoTarefa.value.trim(),
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
        campoTarefa.value = ''
        campoTarefa.focus()
    }
}

// função que verifica se a tarefa já está na lista
function verificaTarefa(lista, tarefa) {
    for (let i=0; i<lista.length; i++) {
        let item = lista[i]
        if (item["Tarefa"].toLowerCase() == tarefa.value.trim().toLowerCase()) {
            alert("Esta tarefa já está na lista de afazeres.")
            tarefa.value = ''
            tarefa.focus()
            return false
        }
    }
    return true
}


// função que apaga a lista do local storage e da página
function resetarLista() {
    let excluir = confirm("Deseja apagar toda a lista?")

    if (excluir) {
        // apaga a lista do local storage, listaTarefas = []
        localStorage.setItem("listaTarefas", JSON.stringify([])) 
        // apagar a lista da página
        let node = document.getElementById("divLista")
        while (node.firstChild) {
            node.removeChild(node.firstChild)
        }
    }
}

