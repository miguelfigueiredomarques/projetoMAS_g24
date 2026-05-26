const reservasLista = document.getElementById("reservasLista");

function renderReservas() {
  console.log("DEBUG [Reservas]: Iniciando renderReservas...");
  
  if (!reservasLista) {
    console.error("DEBUG [Reservas]: Elemento reservasLista não encontrado!");
    return;
  }

  const reservas = getReservas();
  console.log("DEBUG [Reservas]: Lista de reservas obtida:", reservas);

  if(reservas.length === 0) {
    reservasLista.innerHTML = `
      <div class="empty-reservas">
        <p>Ainda não tem nenhum equipamento reservado.</p>
        <a href="catalogo.html" class="btn">Explorar Catálogo</a>
      </div>
    `;
  } else {
    let html = "";
    reservas.forEach((reserva, index) => {
      html += `
        <div class="reserva-item">
          <img src="${reserva.imagem}" alt="${reserva.nome}">
          <div class="reserva-detalhes">
            <h3>${reserva.nome}</h3>
            <p class="reserva-meta">Data: ${reserva.dataReserva}</p>
            <p class="reserva-preco">${reserva.preco}€/mês</p>
          </div>
          <button class="btn-remove" onclick="handleRemover(${index})">Remover</button>
        </div>
      `;
    });
    reservasLista.innerHTML = html;
  }
}

// Global handler for removal to be accessible from HTML
window.handleRemover = function(index) {
  if(confirm("Deseja cancelar esta reserva?")) {
    const sucesso = removeReserva(index);
    if (sucesso) {
      renderReservas();
    } else {
      alert("Erro ao remover a reserva.");
    }
  }
}

// Initial render
document.addEventListener("DOMContentLoaded", renderReservas);