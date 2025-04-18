#ifndef SENSOR_MANAGEMENT_H
#define SENSOR_MANAGEMENT_H

#include "DHT.h"
#include <Adafruit_MLX90614.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "lcd_display.h"
#include "wifi_firebase.h"


#define DHT_PIN 15
#define DHT_TYPE DHT11
#define MQ6_PIN 33
#define MQ9_PIN 34
#define MQ6_MIN 0
#define MQ6_MAX 4095
#define MQ9_MIN 0
#define MQ9_MAX 4095

const int numSamples = 10;


const int MQ_THRESHOLD = 4095;
const float HUMIDITY_THRESHOLD = 80.0;
const float HUMIDITY_LOW_THRESHOLD = 30.0;
const float TEMP_THRESHOLD = 38.0;
const float AMBIENT_TEMP_THRESHOLD = 40.0; 
const float FIRE_TEMP_THRESHOLD = 60.0;


#define LED1_PIN 12 
#define LED2_PIN 22 
#define LED3_PIN 32 
#define LED4_PIN 25 
#define BUZZER_PIN 4 

const unsigned long ALERT_DURATION = 30000;

DHT dht(DHT_PIN, DHT_TYPE);
Adafruit_MLX90614 mlx = Adafruit_MLX90614();
extern LiquidCrystal_I2C lcd1;
extern LiquidCrystal_I2C lcd2;
void triggerBuzzer();
bool buzzerTriggered = false;

bool mq6AlertSent = false;
bool mq9AlertSent = false;
bool humidityHighAlertSent = false;
bool humidityLowAlertSent = false;
bool ambientTempAlertSent = false;
bool fireTempAlertSent = false;
bool objectTempAlertSent = false;


struct GasReadings {
  float mq6;
  float mq9;
  int rawMQ6;  
  int rawMQ9;
  float airQualityPercentage;
};


struct EnvironmentReadings {
  float humidity;
  float ambientTemp;
  float objectTemp;
};

GasReadings lastValidGasReadings = { 0, 0, 0, 0, 0 };
EnvironmentReadings lastValidEnvReadings = { 0, 0, 0 };


struct AlertState {
  bool active;
  unsigned long startTime;
};

AlertState mq6Alert = { false, 0 };
AlertState mq9Alert = { false, 0 };
AlertState humidityAlert = { false, 0 };
AlertState tempAlert = { false, 0 };


void initSensors() {
  dht.begin();
  Wire.begin(19, 18);
  Wire.setClock(100000);

    pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
  pinMode(LED3_PIN, OUTPUT);
  pinMode(LED4_PIN, OUTPUT);

  lcd1.begin();
  lcd1.backlight();
  lcd1.setCursor(0, 0);
  lcd1.print("System Starting..");
  delay(2000);
  lcd1.clear();

  lcd2.begin();
  lcd2.backlight();
  lcd2.setCursor(0, 0);
  lcd2.print("System Starting..");
  delay(2000);
  lcd2.clear();



  if (!mlx.begin()) {
    Serial.println("Error connecting to MLX90614!");

  }
  Serial.println("MLX90614 Initialized Successfully");

}

float mapToPercentage(float reading, float minReading, float maxReading) {
  if (maxReading == minReading) { 
    return 0;
  }
  return ((reading - minReading) / (maxReading - minReading)) * 100.0;
}

GasReadings readGasSensors() {
  float totalMQ6 = 0, totalMQ9 = 0;
  GasReadings readings;
  readings.rawMQ6 = 0;
  readings.rawMQ9 = 0;

  for (int i = 0; i < numSamples; i++) {
    readings.rawMQ6 += analogRead(MQ6_PIN);
    readings.rawMQ9 += analogRead(MQ9_PIN);
    
  }
  readings.rawMQ6 /= numSamples;  
  readings.rawMQ9 /= numSamples;  

  readings.mq6 = mapToPercentage(readings.rawMQ6, MQ6_MIN, MQ6_MAX);
  readings.mq9 = mapToPercentage(readings.rawMQ9, MQ9_MIN, MQ9_MAX);

  float weightMQ6 = 0.5;
  float weightMQ9 = 0.5;
  readings.airQualityPercentage = (readings.mq6 * weightMQ6) + (readings.mq9 * weightMQ9);

  if (!isnan(readings.mq6) && !isnan(readings.mq9)) {
    lastValidGasReadings = readings;
  } else {
    

    readings.mq6 = 0.0;
    readings.mq9 = 0.0;
    readings.airQualityPercentage = 0.0;
  }

  return readings;  
}

EnvironmentReadings manageEnvironment() {
  float totalHumidity = 0, totalAmbientTemp = 0, totalObjectTemp = 0;
  for (int i = 0; i < numSamples; i++) {
    totalHumidity += dht.readHumidity();
    totalAmbientTemp += mlx.readAmbientTempC();
    totalObjectTemp += mlx.readObjectTempC();
    delay(100);
  }
  EnvironmentReadings readings;
  readings.humidity = totalHumidity / numSamples;
  readings.ambientTemp = totalAmbientTemp / numSamples;
  readings.objectTemp = totalObjectTemp / numSamples;

  if (!isnan(readings.humidity) && !isnan(readings.ambientTemp) && !isnan(readings.objectTemp)) {
    lastValidEnvReadings = readings;
  } else {
    

    readings.humidity = 0.0;
    readings.ambientTemp = 0.0;
    readings.objectTemp = 0.0;
  }

  return readings;  
}


void updateAlerts() {
  static unsigned long lastBuzzerToggle = 0;
  static bool buzzerOn = false;
  unsigned long currentMillis = millis();


  bool anyAlertActive = mq6Alert.active || mq9Alert.active || humidityAlert.active || tempAlert.active;


  digitalWrite(LED1_PIN, mq6Alert.active ? HIGH : LOW);
  digitalWrite(LED2_PIN, mq9Alert.active ? HIGH : LOW);
  digitalWrite(LED3_PIN, humidityAlert.active ? HIGH : LOW);
  digitalWrite(LED4_PIN, tempAlert.active ? HIGH : LOW);


  if (anyAlertActive) {
    if (currentMillis - lastBuzzerToggle >= 500) {
      lastBuzzerToggle = currentMillis;
      buzzerOn = !buzzerOn;
      if (buzzerOn) {
        tone(BUZZER_PIN, 1000); 
      } else {
        noTone(BUZZER_PIN);
      }
    }
  } else {
    noTone(BUZZER_PIN);
    buzzerOn = false;
  }

 
  if (mq6Alert.active && currentMillis - mq6Alert.startTime >= ALERT_DURATION) {
    mq6Alert.active = false;
    Serial.println("[ALERT] MQ6 alert ended");
  }
  if (mq9Alert.active && currentMillis - mq9Alert.startTime >= ALERT_DURATION) {
    mq9Alert.active = false;
    Serial.println("[ALERT] MQ9 alert ended");
  }
  if (humidityAlert.active && currentMillis - humidityAlert.startTime >= ALERT_DURATION) {
    humidityAlert.active = false;
    Serial.println("[ALERT] Humidity alert ended");
  }
  if (tempAlert.active && currentMillis - tempAlert.startTime >= ALERT_DURATION) {
    tempAlert.active = false;
    Serial.println("[ALERT] Temperature alert ended");
  }
}


void checkThresholds(GasReadings gas, EnvironmentReadings env) {
  unsigned long currentMillis = millis();


  if (gas.rawMQ6 >= MQ_THRESHOLD) {
    if (!mq6Alert.active) {
      mq6Alert.active = true;
      mq6Alert.startTime = currentMillis;
      Serial.println("[ALERT] MQ6 Threshold Reached: " + String(gas.rawMQ6));
    }
    if (!mq6AlertSent) {
      sendThresholdAlert("mq6", true);
      mq6AlertSent = true;
    }
  } else {
    if (mq6AlertSent) {
      mq6AlertSent = false;
    }
  }


  if (gas.rawMQ9 >= MQ_THRESHOLD) {
    if (!mq9Alert.active) {
      mq9Alert.active = true;
      mq9Alert.startTime = currentMillis;
      Serial.println("[ALERT] MQ9 Threshold Reached: " + String(gas.rawMQ9));
    }
    if (!mq9AlertSent) {
      sendThresholdAlert("mq9", true);
      mq9AlertSent = true;
    }
  } else {
    if (mq9AlertSent) {
      mq9AlertSent = false;
    }
  }

  if (env.humidity >= HUMIDITY_THRESHOLD || env.humidity <= HUMIDITY_LOW_THRESHOLD) {
    if (!humidityAlert.active) {
      humidityAlert.active = true;
      humidityAlert.startTime = currentMillis;
      Serial.println("[ALERT] Humidity Threshold Reached: " + String(env.humidity));
    }
    if (env.humidity >= HUMIDITY_THRESHOLD && !humidityHighAlertSent) {
      sendThresholdAlert("humidity_high", true);
      humidityHighAlertSent = true;
    }
  } else {
    if (humidityHighAlertSent) {
      humidityHighAlertSent = false;
    }
  }

  if (env.ambientTemp >= TEMP_THRESHOLD || env.objectTemp >= TEMP_THRESHOLD) {
    if (!tempAlert.active) {
      tempAlert.active = true;
      tempAlert.startTime = currentMillis;
      Serial.println("[ALERT] Temperature Threshold Reached: Ambient=" + String(env.ambientTemp) + ", Object=" + String(env.objectTemp));
    }
    if (env.ambientTemp >= AMBIENT_TEMP_THRESHOLD && !ambientTempAlertSent) {
      sendThresholdAlert("ambient_temp", true);
      ambientTempAlertSent = true;
    }
    if (env.ambientTemp >= FIRE_TEMP_THRESHOLD && !fireTempAlertSent) {
      sendThresholdAlert("fire_temp", true);
      fireTempAlertSent = true;
    }
    if (env.objectTemp >= TEMP_THRESHOLD && !objectTempAlertSent) {
      sendThresholdAlert("object_temp", true);
      objectTempAlertSent = true;
    }
  } else {
    if (ambientTempAlertSent) ambientTempAlertSent = false;
    if (fireTempAlertSent) fireTempAlertSent = false;
    if (objectTempAlertSent) objectTempAlertSent = false;
  }

 
  updateAlerts();
}

void triggerBuzzer() {
     for (int i = 0; i < 2; i++) {
        tone(BUZZER_PIN, 1200);
        delay(250);
        tone(BUZZER_PIN, 800);
        delay(250);
        noTone(BUZZER_PIN);
        delay(250);
    }
}



String getWeatherCondition(float humidity, float ambientTemp) {
  
  ambientTemp = round(ambientTemp * 10) / 10.0;

  if (humidity >= 80 && ambientTemp >= 22 && ambientTemp <= 31) {
    return "Rainy Day";
  } else if (humidity >= 70 && humidity <= 80 && ambientTemp >= 25 && ambientTemp <= 31) {
    return "Cloudy Day";
  } else if (humidity <= 65 && ambientTemp >= 30 && ambientTemp <= 35) {
    return "Sunny Day";
  } else if (humidity <= 50 && ambientTemp <= 22) {
    return "Clear, Cool Day";
  } else {
    return "Unknown Condition";  
  }
}


#endif
