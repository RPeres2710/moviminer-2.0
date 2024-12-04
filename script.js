// Inicializando o mapa com a posição do Rio de Janeiro
const map = L.map('map').setView([-22.9068, -43.1729], 12); // Coordenadas do Rio de Janeiro

// Configurando a camada de mapa usando o OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Função para lidar com a seleção do estado (RJ ou SP)
document.getElementById('estado').addEventListener('change', function () {
    const estado = this.value;
    const zonasRj = document.getElementById('zonas-rj');

    // Se o estado selecionado for RJ, mostra a caixa de zonas
    if (estado === 'RJ') {
        zonasRj.style.display = 'block';
    } else {
        zonasRj.style.display = 'none';
    }
});

// Função para lidar com o envio do formulário
document.getElementById('clipping-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita o envio padrão do formulário

    // Coletando os dados do formulário
    const data = document.getElementById('data').value;
    const tipicidade = document.getElementById('tipicidade').value;
    const regiao = document.getElementById('regiao').value;
    const link = document.getElementById('link').value;

    // Validando campos do formulário
    if (!data || !tipicidade || !regiao || !link) {
        alert('Por favor, preencha todos os campos antes de enviar.');
        return;
    }

    // Exibindo os dados no console (pode ser substituído por lógica para salvar os dados)
    console.log('Dados do Clipping:');
    console.log('Data:', data);
    console.log('Tipicidade:', tipicidade);
    console.log('Região:', regiao);
    console.log('Link:', link);

    // Adicionando um marcador no mapa
    // Exemplo: Use coordenadas específicas de cada região para ajustar o marcador
    L.marker([-22.9068, -43.1729]) // Coordenadas do Rio de Janeiro (ajustar conforme necessário)
        .addTo(map)
        .bindPopup(`<b>Incidente: ${tipicidade}</b><br>Data: ${data}<br>Região: ${regiao}<br>Link: <a href="${link}" target="_blank">${link}</a>`)
        .openPopup();

    // Mensagem de sucesso para o usuário
    alert('Clipping adicionado com sucesso!');

    // Resetando o formulário após o envio
    document.getElementById('clipping-form').reset();
});

// Array para armazenar os dados do formulário
const incidentData = [];

// Função para lidar com o envio do formulário
document.getElementById('clipping-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita o envio padrão do formulário

    // Coletando os dados do formulário
    const data = document.getElementById('data').value;
    const tipicidade = document.getElementById('tipicidade').value;
    const regiao = document.getElementById('regiao').value;
    const link = document.getElementById('link').value;

    // Adicionando os dados ao array
    incidentData.push({ data, tipicidade, regiao, link });

    // Adicionando um marcador no mapa
    L.marker([-22.9068, -43.1729])  // Usando coordenadas do Rio de Janeiro
        .addTo(map)
        .bindPopup(`<b>Incidente: ${tipicidade}</b><br>Data: ${data}<br>Link: <a href="${link}" target="_blank">${link}</a>`)
        .openPopup();

    // Resetando o formulário após o envio
    document.getElementById('clipping-form').reset();
});

// Função para exportar dados em CSV
function exportToCSV(data) {
    if (data.length === 0) {
        alert('Nenhum dado disponível para exportar!');
        return;
    }

    // Criando o conteúdo do CSV
    const header = ['Data', 'Tipicidade', 'Região', 'Link'];
    const rows = data.map(item => [item.data, item.tipicidade, item.regiao, item.link]);
    const csvContent = [header, ...rows]
        .map(row => row.join(','))
        .join('\n');

    // Criando o arquivo CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Criando um link para download
    const link = document.createElement('a');
    link.href = url;
    link.download = `dados_incidentes_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Adicionando o evento ao botão de exportar
document.getElementById('export-csv').addEventListener('click', function () {
    exportToCSV(incidentData);

    // Função para salvar e exibir registros
document.getElementById("clipping-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // Coleta os dados do formulário
    const data = document.getElementById("data").value;
    const tipicidade = document.getElementById("tipicidade").value;
    const endereco = document.getElementById("endereco").value;
    const estado = document.getElementById("estado").value;
    const mes = document.getElementById("mes").value;
    const link = document.getElementById("link").value;

    // Cria o objeto de registro
    const registro = { data, tipicidade, endereco, estado, mes, link };

    // Armazena os dados no localStorage
    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    registros.push(registro);
    localStorage.setItem("registros", JSON.stringify(registros));

    // Limpa o formulário após a submissão
    document.getElementById("clipping-form").reset();

    // Atualiza a exibição dos registros
    exibirRegistros();
});

// Função para exibir os registros
function exibirRegistros(filtroData = "", filtroTipo = "", filtroMes = "") {
    const registros = JSON.parse(localStorage.getItem("registros")) || [];
    const listaRegistros = document.getElementById("lista-registros");
    listaRegistros.innerHTML = ""; // Limpa os registros exibidos

    // Filtra os registros
    const registrosFiltrados = registros.filter(registro => {
        const dataValida = filtroData ? registro.data === filtroData : true;
        const tipoValido = filtroTipo ? registro.tipicidade === filtroTipo : true;
        const mesValido = filtroMes ? registro.mes === filtroMes : true;
        return dataValida && tipoValido && mesValido;
    });

    // Exibe os registros filtrados
    registrosFiltrados.forEach(registro => {
        const divRegistro = document.createElement("div");
        divRegistro.classList.add("registro-item");
        divRegistro.innerHTML = `
            <p><strong>Data:</strong> ${registro.data}</p>
            <p><strong>Tipicidade:</strong> ${registro.tipicidade}</p>
            <p><strong>Endereço:</strong> ${registro.endereco}</p>
            <p><strong>Estado:</strong> ${registro.estado}</p>
            <p><strong>Mês:</strong> ${registro.mes}</p>
            <p><strong>Link:</strong> <a href="${registro.link}" target="_blank">Acessar</a></p>
        `;
        listaRegistros.appendChild(divRegistro);
    });
}

// Exibe os registros ao carregar a página
window.onload = function() {
    exibirRegistros();
};

// Função para filtrar os registros
document.getElementById("filtrar-btn").addEventListener("click", function() {
    const filtroData = document.getElementById("filtro-data").value;
    const filtroTipo = document.getElementById("filtro-tipo").value;
    const filtroMes = document.getElementById("filtro-mes").value;
    exibirRegistros(filtroData, filtroTipo, filtroMes);
});

    
});



