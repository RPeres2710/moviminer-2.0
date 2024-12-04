document.addEventListener("DOMContentLoaded", () => {
    // Configuração do mapa Leaflet
    const map = L.map('map').setView([-15.7942, -47.8822], 4); // Coordenadas do Brasil
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Referências ao DOM
    const form = document.getElementById("incidentForm");
    const popup = document.getElementById("popup");
    const closePopupBtn = document.getElementById("closePopup");
    const tableBody = document.getElementById("tableBody");

    // Função para criar um marcador e adicionar à tabela
    const addIncident = (data) => {
        // Criar marcador no mapa
        const marker = L.marker([data.latitude, data.longitude]).addTo(map);
        marker.bindPopup(`
            <strong>${data.tipicidade}</strong><br>
            Região: ${data.regiao}<br>
            Estado: ${data.estado}<br>
            Data: ${data.data}
        `);

        // Adicionar dados à tabela
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${data.data}</td>
            <td>${data.tipicidade}</td>
            <td>${data.regiao}</td>
            <td>${data.estado}</td>
        `;
        tableBody.appendChild(row);
    };

    // Função para mostrar ou esconder a pop-up
    const togglePopup = () => {
        popup.style.display = popup.style.display === "none" ? "block" : "none";
    };

    // Evento ao enviar o formulário
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Capturar valores do formulário
        const tipicidade = document.getElementById("tipicidade").value;
        const regiao = document.getElementById("regiao").value;
        const estado = document.getElementById("estado").value;
        const data = new Date().toLocaleDateString(); // Data automática
        const latitude = -15.7942 + Math.random(); // Simulação de coordenadas
        const longitude = -47.8822 + Math.random(); // Simulação de coordenadas

        // Criar objeto de dados
        const incidentData = { tipicidade, regiao, estado, data, latitude, longitude };

        // Adicionar incidente ao mapa e à tabela
        addIncident(incidentData);

        // Mostrar pop-up
        togglePopup();
    });

    // Evento para fechar a pop-up
    closePopupBtn.addEventListener("click", togglePopup);
});




