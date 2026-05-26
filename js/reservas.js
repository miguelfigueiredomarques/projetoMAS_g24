const reservasLista = document.getElementById("reservasLista");

const reservas = getReservas();

if(reservas.length === 0) {
  reservasLista.innerHTML = "<p>Não existem reservas.</p>";
}
else {
  reservas.forEach((reserva, index) => {
    reservasLista.innerHTML += `
      <div class="reserva-card">
        <h3>${reserva.nome}</h3>
        <p>${reserva.preco}€/mês</p>

        <button onclick="removerReserva(${index})">
          Remover
        </button>
      </div>
    `;
  });
}

function removerReserva(index) {
  reservas.splice(index, 1);

  localStorage.setItem("reservas", JSON.stringify(reservas));

  location.reload();
}