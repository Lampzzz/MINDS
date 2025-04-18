export function convertToHoursAndMinutes(input: string): {
  number: number;
  text: string;
} {
  const parts = input.split(" ");
  let totalMinutes = 0;

  for (let i = 0; i < parts.length; i++) {
    const value = parseInt(parts[i]);
    const unit = parts[i + 1];

    switch (unit) {
      case "day":
      case "days":
        totalMinutes += value * 24 * 60;
        break;
      case "hour":
      case "hours":
        totalMinutes += value * 60;
        break;
      case "minute":
      case "minutes":
        totalMinutes += value;
        break;
    }
  }

  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  if (days >= 1) {
    return {
      number: days,
      text: days === 1 ? "day left" : "days left",
    };
  }

  return hours >= 1
    ? {
        number: hours,
        text: hours === 1 ? "hour left" : "hours left",
      }
    : {
        number: minutes,
        text: minutes === 1 ? "minute left" : "minutes left",
      };
}
