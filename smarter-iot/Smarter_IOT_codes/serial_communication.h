#ifndef SERIAL_COMMUNICATION_H
#define SERIAL_COMMUNICATION_H
#include <Arduino.h>
#include "door_lock.h"
#include "relay_control.h"

#define RXp2 16
#define TXp2 17

#define RXp3 14  
#define TXp3 13  

 extern String rfidData;

String rfidData = "";



void initSerial() {
    Serial.begin(115200);
    Serial1.begin(9600, SERIAL_8N1, RXp2, TXp2);
    Serial2.begin(9600, SERIAL_8N1, RXp3, TXp3);
}

bool receiveData() {
    if (Serial1.available()) {
        String data = Serial1.readStringUntil('\n');
        data.trim();
        int commaIndex = data.indexOf(',');
        if (commaIndex != -1) {
            String voltageStr = data.substring(0, commaIndex);
            String currentStr = data.substring(commaIndex + 1);
            voltage = voltageStr.toFloat();
            current = currentStr.toFloat();



            if (current < 0) current = 0.0;
            if (voltage < 0) voltage = 0.0;
            return true;
        }
        return false;
    }
    return false;
}


bool receiveDataFromSecondArduino() {
  if (Serial2.available()) {
     rfidData = Serial2.readStringUntil('\n');
    rfidData.trim();
    


handleRFID(rfidData);

processRfidData();
return true;
  }
  return false;
}

bool receiveDataNonBlocking() {
    static String buffer = "";
    while (Serial1.available()) {
        char c = Serial1.read();
        if (c == '\n') {
            buffer.trim();
            int commaIndex = buffer.indexOf(',');
            if (commaIndex != -1) {
                voltage = buffer.substring(0, commaIndex).toFloat();
                current = buffer.substring(commaIndex + 1).toFloat();
                if (current < 0) current = 0.0;
                if (voltage < 0) voltage = 0.0;
                buffer = "";
                return true;
            }
            buffer = "";
        } else {
            buffer += c;
        }
    }
    return false;
}

bool receiveDataFromSecondArduinoNonBlocking() {
    static String buffer = "";
    while (Serial2.available()) {
        char c = Serial2.read();
        if (c == '\n') {
            rfidData = buffer;
            rfidData.trim();
            handleRFID(rfidData);
            processRfidData();
            buffer = "";
            return true;
        } else {
            buffer += c;
        }
    }
    return false;
}


#endif