export const getBatteryLabel = (data: number): string => {
  if (data >= 100) {
    return "Fully Charged";
  } else if (data >= 90) {
    return "Almost Full";
  } else if (data >= 70) {
    return "Strong Charge";
  } else if (data >= 50) {
    return "Half Charged";
  } else if (data >= 30) {
    return "Low Charge";
  } else if (data >= 20) {
    return "Very Low Charge";
  } else if (data >= 10) {
    return "Critically Low";
  } else {
    return "Nearly Depleted";
  }
};

export const getTemperatureLabel = (temp: number): string => {
  if (temp >= 40) {
    return "Super Hot";
  } else if (temp >= 35) {
    return "Really Hot";
  } else if (temp >= 32) {
    return "Hot";
  } else if (temp >= 28) {
    return "Nice and Warm";
  } else if (temp >= 25) {
    return "Just Right";
  } else if (temp >= 20) {
    return "A Bit Cool";
  } else if (temp >= 15) {
    return "Pretty Cold";
  } else {
    return "Very Cold";
  }
};

export const getAirQualityLabel = (aqi: number): string => {
  if (aqi >= 300) {
    return "Hazardous";
  } else if (aqi >= 200) {
    return "Very Unhealthy";
  } else if (aqi >= 150) {
    return "Unhealthy";
  } else if (aqi >= 100) {
    return "Moderate";
  } else if (aqi >= 50) {
    return "Good";
  } else if (aqi >= 0) {
    return "Excellent";
  } else {
    return "No Data";
  }
};

export const getHumidityLabel = (humidity: number): string => {
  if (humidity >= 90) {
    return "Very humid air";
  } else if (humidity >= 70) {
    return "Humid air";
  } else if (humidity >= 50) {
    return "Moderate";
  } else if (humidity >= 30) {
    return "Comfortable air";
  } else if (humidity >= 20) {
    return "Dry air";
  } else if (humidity >= 0) {
    return "Very dry air";
  } else {
    return "No data available";
  }
};
