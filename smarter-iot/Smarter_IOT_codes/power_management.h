#ifndef POWER_MANAGEMENT_H
#define POWER_MANAGEMENT_H

#include <Arduino.h>



#define relayPin 23


extern float energy;
extern float runningTime;



float cutoffVoltage = 10.0;
float nominalVoltage = 13.8;
float voltage = 0.0;
float current = 0.0;
float power = 0.0;
 float energyConsumption = 0.0;
float sampleEnergy = 0.0;
float batteryCapacity = 281.6;
float remainingCapacity = 0.0;


float usableCapacity = 0.0;
float runTime = 0.0;
float remainingTime =0.0;
String remainingUsageTime = "";
const float CURRENT_LIMIT = 9.5;


unsigned long previousMillis = 0;
const unsigned long interval = 1000;

void initPowerManagement() {
      pinMode(relayPin, OUTPUT);  
    digitalWrite(relayPin, HIGH);
}

void calculatePower() {
    power = voltage * current;
}

void calculateEnergy() {
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
        previousMillis = currentMillis;
        float timeHours = interval / (1000.0 * 60.0 * 60.0);

float energyForInterval = power * timeHours;
   

        energyConsumption += energyForInterval;

        remainingCapacity = (voltage/nominalVoltage) * batteryCapacity;
bool resetPerformed = false;

if (voltage >= 13.4) {
    if (!resetPerformed && energyConsumption == 0.0) {
        energyConsumption = 0.0;  
        Serial.println("Battery voltage reached 13.4V and energy consumption is zero. Energy consumption reset.");
        resetPerformed = true;
    } else if (resetPerformed) {
        Serial.println("Battery voltage is still above 13.4V. No reset performed.");
    }
}

else if (energyConsumption == 0.000) {
   
    float initialEnergy = nominalVoltage * batteryCapacity;


    float remainingEnergy = voltage * remainingCapacity;

    energyConsumption = initialEnergy - remainingEnergy;

    Serial.println("Energy consumption estimated based on initial energy and remaining energy.");
}

else {
    energyConsumption = energy + energyForInterval; 
}




        

        float time =  5.0 / 3600.0;
        runTime = runningTime + time;

    }
}

float calculateBatteryPercentage() {


      float maxVoltage = 13.8; 
    float minVoltage = 10.0;  


    if (voltage > maxVoltage) voltage = maxVoltage;
    if (voltage < minVoltage) voltage = minVoltage;


    float percentage = ((voltage - minVoltage) / (maxVoltage - minVoltage)) * 100.0;
    
    
    return percentage;
}

void checkCurrentLimit() {
    if (current > CURRENT_LIMIT) {
        Serial.println("Current limit exceeded! Turning off inverter.");
        digitalWrite(relayPin, LOW); 
    }
}


String calculateRemainingUsageTime() {
    float maxVoltage = 13.8;  
    float minVoltage = 10.0;  
    float batteryCapacity = 9.0;  

    
    voltage = constrain(voltage, minVoltage, maxVoltage);
    

    float percentage = ((voltage - minVoltage) / (maxVoltage - minVoltage)) * 100.0;


    float usableCapacity = (percentage / 100.0) * batteryCapacity;

    float remainingTime = 0.0; 

    if (current > 0) {
        remainingTime = usableCapacity / current;  
    } else {
        
        float idleDrain = 0.05;  
        remainingTime = usableCapacity / idleDrain;  
    }


    int totalHours = floor(remainingTime);
    int remainingMinutes = (remainingTime - totalHours) * 60;
    int days = totalHours / 24;
    int hours = totalHours % 24;

   
    String usageTimePhrase = "";
    if (days > 0) {
        usageTimePhrase += String(days) + " day" + (days > 1 ? "s" : "") + " ";
    }
    if (hours > 0) {
        usageTimePhrase += String(hours) + " hour" + (hours > 1 ? "s" : "") + " ";
    }
    if (remainingMinutes > 0) {
        usageTimePhrase += String(remainingMinutes) + " minute" + (remainingMinutes > 1 ? "s" : "");
    }

    return usageTimePhrase;
}



void displayData() {
  
    int runTimeHours = floor(runTime);  
    int runTimeMinutes = (runTime - runTimeHours) * 60;  
    int runTimeDays = runTimeHours / 24;  
    int runTimeRemainingHours = runTimeHours % 24;  


    String runTimeFormatted = "";
    if (runTimeDays > 0) {
        runTimeFormatted += String(runTimeDays) + " day" + (runTimeDays > 1 ? "s" : "") + " ";
    }
    if (runTimeRemainingHours > 0) {
        runTimeFormatted += String(runTimeRemainingHours) + " hour" + (runTimeRemainingHours > 1 ? "s" : "") + " ";
    }
    if (runTimeMinutes > 0) {
        runTimeFormatted += String(runTimeMinutes) + " minute" + (runTimeMinutes > 1 ? "s" : "");
    }
    
int totalHours = floor(remainingTime);  
    int remainingMinutes = (remainingTime - totalHours) * 60;  
    int days = totalHours / 24;  
    int hours = totalHours % 24; 
    
   
    String usageTimePhrase = "";
    if (days > 0) {
        usageTimePhrase += String(days) + " day" + (days > 1 ? "s" : "") + " ";
    }
    if (hours > 0) {
        usageTimePhrase += String(hours) + " hour" + (hours > 1 ? "s" : "") + " ";
    }
    if (remainingMinutes > 0) {
        usageTimePhrase += String(remainingMinutes) + " minute" + (remainingMinutes > 1 ? "s" : "");
    }




    Serial.print("Voltage: "); Serial.print(voltage, 2); Serial.println(" V");
    Serial.print("Current: "); Serial.print(current, 2); Serial.println(" A");
    Serial.print("Power: "); Serial.print(power, 3); Serial.println(" W");
    Serial.print("Energy: "); Serial.print(energy, 3); Serial.println(" Wh");
  
    Serial.print("Remaining Capacity: "); Serial.print(remainingCapacity, 3); Serial.println(" Wh");
    Serial.print("Battery Percentage: "); Serial.print(calculateBatteryPercentage(), 2); Serial.println("%");
   

    Serial.print("Running Time: ");
    Serial.println(runTimeFormatted);  

    Serial.print("Remaining Usage Time: ");
    Serial.println(usageTimePhrase);
    remainingUsageTime = usageTimePhrase;

}

#endif
