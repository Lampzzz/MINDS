#include <Arduino.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>




#include "relay_control.h"
#include "power_management.h"
#include "sensor_management.h"

#include "serial_communication.h"
#include "wifi_firebase.h"


#include "door_lock.h"

#include "lcd_display.h"









unsigned long lastDisplayTime = 0; 
const unsigned long displayInterval = 5000; 

unsigned long lastDataFetchTime = 0;  
const unsigned long dataFetchInterval = 2000;
unsigned long lastMetricsUploadTime = 0; 


const unsigned long metricsUploadInterval = 60000;

unsigned long lastDeviceStateCheckTime = 0; 

const unsigned long deviceStateCheckInterval = 10000;

bool buttonPressed = false; 

float energy = 0.0;
float runningTime = 0.0;
extern String keyCardId; 
extern bool buttonPressed;
extern bool buttonLcdPressed;

extern String latestAnnouncement;
String lastAnnouncement = "";


bool isShelterKeyFetched = false;
bool shelterSaved = false; 

String inverterValue = "";
String inverterTimestamp;
String lastInverterTimestamp = "";

String doorValue = "";
String doorTimestamp;
String lastDoorTimestamp = "";

String displayAccess = "";
String tempTimestamp;
String lastTempTimestamp = "";



bool wifiConnected = false; 
DataQueueEntry dataQueue[QUEUE_SIZE]; 
int queueIndex = 0;


void setup() {

    
initRelays();
  Serial.println("Relays Initialized");
  initSerial();
  Serial.println("Serial Initialized");
  initDoorLock();
  Serial.println("Door Lock Initialized");
  initPowerManagement();
  Serial.println("Power Management Initialized");
  initSensors();
  Serial.println("Sensors Initialized");
  initLCD();
  Serial.println("LCD Initialized");
  initWiFiAndFirebase();
  Serial.println("WiFi and Firebase Initialized");


        if (!isShelterKeyFetched) {
        

        
        isShelterKeyFetched = true; 
    }

    


  for (int i = 0; i < QUEUE_SIZE; i++) {
    dataQueue[i].jsonData = "";
    dataQueue[i].path = "";
    dataQueue[i].used = false;
  }
    
}

void loop() {


checkWiFiStatus();
initializeFirebase();
  if (!wifiConnected) {
    Serial.println("Running in Offline Mode");
    lcd2.clear();
    lcd2.setCursor(0, 0);
    lcd2.print("Offline Mode");
    delay(1000);
  }

    handleButtonPress();
    handleButton1();
    handleSwitch1();
 receiveDataFromSecondArduino();

        if (receiveData()) {
        calculatePower();
        
    }
    
    checkCurrentLimit();

    
if (millis() - lastDeviceStateCheckTime >= deviceStateCheckInterval) {
    lastDeviceStateCheckTime = millis(); 
if (wifiConnected) { 
            getDeviceState();
            getLatestAnnouncement();
            readAndSaveDocumentId();
        }
    if (inverterTimestamp != lastInverterTimestamp) {
        lastInverterTimestamp = inverterTimestamp; 

        if (inverterValue != "") {
            Serial.println("Processing Inverter Value: " + inverterValue);
            inverterState(inverterValue); 
        } else {
            Serial.println("No inverter value retrieved."); 
        }
    } else {
        
        Serial.println("Timestamp unchanged. Skipping inverterState processing.");
    }


  if (doorTimestamp != lastDoorTimestamp){
    lastDoorTimestamp = doorTimestamp;

    if (doorValue == "open"){
      Serial.print("door Value: ");
Serial.println(doorValue);
    doorState(doorValue);

    }else{
      Serial.println("Ignoring non-open door value.");
    }
  }else{
    Serial.println("Timestamp unchanged. Skipping doorState processing.");
  }


            



}



     if (!buttonPressed) {
        
        if (millis() - lastDisplayTime >= displayInterval) {
            lastDisplayTime = millis(); 
            GasReadings gasReadings = readGasSensors();
            EnvironmentReadings envReadings = manageEnvironment();

checkThresholds(gasReadings, envReadings);

            
            String weatherCondition = getWeatherCondition(envReadings.humidity, envReadings.ambientTemp);
            


            float voltage = ::voltage;
            float current = ::current;
            float power = ::power;
            float energy = ::energyConsumption;
            float remainingCapacity = ::remainingCapacity;
            float batteryPercentage = calculateBatteryPercentage();
            float runTime = ::runTime;
            String remainingUsageTime = calculateRemainingUsageTime();
            
            

updateDisplay(batteryPercentage, remainingUsageTime, envReadings.objectTemp, envReadings.ambientTemp, envReadings.humidity, gasReadings.airQualityPercentage, gasReadings.mq6, gasReadings.mq9 );
displayAnnouncement(latestAnnouncement);

    if (latestAnnouncement != lastAnnouncement) {
        lastAnnouncement = latestAnnouncement; 
        
        
    } else {
       
    }


            bool switchState = digitalRead(SwitchPin1);
           
            bool button2State = digitalRead(ButtonPin2);
            bool relay1State = digitalRead(RelayPin1);
            bool relay2State = digitalRead(RelayPin2);
           
            

            if (millis() - lastMetricsUploadTime >= metricsUploadInterval) {
                lastMetricsUploadTime = millis(); 
    if (wifiConnected) {
    
                
                createAnalyticsValue(gasReadings.airQualityPercentage, gasReadings.mq6, gasReadings.mq9, envReadings.humidity, envReadings.ambientTemp,
                    envReadings.objectTemp, batteryPercentage, remainingUsageTime);
    }
            }
        }
     }


if (wifiConnected) {
    syncQueuedData();
  }

buttonPressed = false; 


}
