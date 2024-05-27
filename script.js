document.getElementById('cadastroForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const destino = document.getElementById('destino').value;
    const data = document.getElementById('data').value;
    const duracao = document.getElementById('duracao').value;
    const descricao = document.getElementById('descricao').value;

    if (!destino || !data || !duracao || !descricao) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const viagem = {
        id: Date.now(),
        destino,
        data,
        duracao,
        descricao
    };

    let viagens = JSON.parse(localStorage.getItem('viagens')) || [];
    viagens.push(viagem);
    localStorage.setItem('viagens', JSON.stringify(viagens));

    document.getElementById('cadastroForm').reset();
    carregarViagens(viagem.id);
    gerarRelatorio(); 
});

document.getElementById('search').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    carregarViagens(null, searchTerm); 
});

function carregarViagens(novaViagemId = null, searchTerm = '') {
    const viagensList = document.getElementById('viagensList');
    viagensList.innerHTML = '';

    const viagens = JSON.parse(localStorage.getItem('viagens')) || [];
    const filteredViagens = viagens.filter(viagem => 
        viagem.destino.toLowerCase().includes(searchTerm) ||
        viagem.descricao.toLowerCase().includes(searchTerm)
    );

    filteredViagens.forEach(viagem => {
        const viagemContainer = document.createElement('div');
        viagemContainer.classList.add('viagem-container');
        
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>Destino:</strong> ${viagem.destino}<br>
            <strong>Data:</strong> ${formatarDataBrasileira(viagem.data)}<br>
            <strong>Duração:</strong> ${viagem.duracao} dias<br>
            <strong>Descrição:</strong> ${viagem.descricao}<br>
            <button onclick="removerViagem(${viagem.id}, this)">Remover</button>
        `;
        if (viagem.id === novaViagemId) {
            li.classList.add('pop-up');
            setTimeout(() => li.classList.remove('pop-up'), 500);
        }
        
        viagemContainer.appendChild(li);
        viagensList.appendChild(viagemContainer);
    });
}

function removerViagem(id, button) {
    let viagens = JSON.parse(localStorage.getItem('viagens')) || [];
    viagens = viagens.filter(viagem => viagem.id !== id);
    localStorage.setItem('viagens', JSON.stringify(viagens));

    const li = button.parentElement;
    li.classList.add('remove');
    li.addEventListener('animationend', () => {
        li.parentElement.remove();
        gerarRelatorio(); 
    });
}

function gerarRelatorio() {
    const viagens = JSON.parse(localStorage.getItem('viagens')) || [];
    const totalViagens = viagens.length;
    const totalDuracao = viagens.reduce((acc, viagem) => acc + parseInt(viagem.duracao), 0);

    const relatorioDados = document.getElementById('relatorioDados');
    relatorioDados.innerHTML = `
        <p><strong>Total de Viagens:</strong> ${totalViagens}</p>
        <p><strong>Duração Total:</strong> ${totalDuracao} dias</p>
    `;
}

function formatarDataBrasileira(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}


carregarViagens();
gerarRelatorio();