export const getTemperatureColor = (temperature: number): string => {
  if (temperature >= 38.1) return "#FCA5A5"; // Deeper red for high fever
  if (temperature >= 37.3) return "#FDBA74"; // Deeper orange for mild fever
  if (temperature >= 36.1) return "#6EE7B7"; // Deeper green for normal
  return "#7DD3FC"; // Deeper blue for low temperature
};
