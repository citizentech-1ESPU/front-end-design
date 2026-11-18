// Aviso de completar o gelo, antes de a caixa passar de 5 °C (objetivo 2 do design:
// evitar a perda, não só vender mais barato). Sem previsão, a caixa já passou de 5 °C: o aviso é para agora.
export default function IceAlert({ minutosAte5C }) {
  const texto =
    minutosAte5C === null || minutosAte5C === undefined
      ? 'Complete o gelo agora'
      : `Complete o gelo: ${Math.ceil(minutosAte5C)} min`;

  return (
    <p role="alert" className="rounded-control bg-ice-bg px-3 py-2 font-bold text-ice">
      {texto}
    </p>
  );
}
