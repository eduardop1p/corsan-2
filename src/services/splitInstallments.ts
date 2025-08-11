export default function splitInstallments(value: number) {
  if (value <= 700) {
    return [value]; // valor menor ou igual a 700, não precisa parcelar
  }

  const installments = Math.ceil(value / 700); // calcula o número mínimo de installments
  const valueInstallments = value / installments; // valor base de cada parcela
  const result = Array(installments).fill(valueInstallments);

  // distribui o valor restante (diferença para bater o value)
  let restante = value - valueInstallments * installments;
  let i = 0;
  while (restante > 0) {
    result[i]++;
    restante--;
    i = (i + 1) % installments;
  }

  return result;
}
