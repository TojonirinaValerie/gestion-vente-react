export const toLocalString = (number: number, local?: string) => {
  return number.toLocaleString(local || "en-US");
};

export function arrondir(n: number, floatant: number): number {
  if (n % 1 === 0) {
    // Si n est un nombre entier, retournez-le sans virgule
    return n;
  } else {
    // Si n a des décimales, arrondissez-le à un chiffre après la virgule
    return Number(n.toFixed(floatant));
  }
}
