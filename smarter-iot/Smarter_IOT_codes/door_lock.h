#ifndef DOOR_LOCK_H
#define DOOR_LOCK_H

#include <Arduino.h>

#include "wifi_firebase.h"
#include "lcd_display.h"
#define RelayPin2 26
#define BUZZER_PIN 4  
#define LED_PIN 0

void accessGranted();

void accessDenied();
void processRFIDData();
void sendDoorLockState(const String &state);

extern String rfidData;   
extern String getStoredRFID();

void initDoorLock() {
    pinMode(RelayPin2, OUTPUT);
    pinMode(BUZZER_PIN, OUTPUT);
    pinMode(LED_PIN, OUTPUT);

    digitalWrite(RelayPin2, HIGH); 
    digitalWrite(LED_PIN, LOW);   
    noTone(BUZZER_PIN);           
}

void processRfidData() {
    if (rfidData.isEmpty()) {
        Serial.println("Error: rfidData is empty.");
        return;
    }

String keyCardId = getStoredRFID(); 
    if (keyCardId.isEmpty()) {
        
        Serial.println("No keycard ID stored yet. Reset and scan a new RFID.");
        return;
    }

    
    Serial.print("KeyCard ID: ");
    Serial.println(keyCardId);
    Serial.print("RFID Data: ");
    Serial.println(rfidData);

    
    if (rfidData == keyCardId) {
        accessGranted();
                       lcd2.clear();
  lcd2.setCursor(0, 0);
  lcd2.print("Access Granted");
        
    } else {
        accessDenied();
                       lcd2.clear();
  lcd2.setCursor(0, 0);
  lcd2.print("Access Denied!");
    }
    rfidData = "";
}




void accessGranted() {
    
    digitalWrite(RelayPin2, LOW);
    sendDoorLockState("open");

    
    digitalWrite(LED_PIN, HIGH);

    tone(BUZZER_PIN, 800);  
    delay(200);
    tone(BUZZER_PIN, 1000); 
    delay(200);
    tone(BUZZER_PIN, 1200); 
    delay(500); 
    noTone(BUZZER_PIN);
    
    delay(500);  
    digitalWrite(LED_PIN, LOW);

  
    delay(5000);
    
  
    digitalWrite(RelayPin2, HIGH);
    sendDoorLockState("close");
}

void accessDenied() {
    Serial.println("Access Denied!");

 
    for (int i = 0; i < 2; i++) {
        digitalWrite(LED_PIN, HIGH);
        tone(BUZZER_PIN, 1200);
        delay(250);
        tone(BUZZER_PIN, 800);
        delay(250);
        noTone(BUZZER_PIN);
        digitalWrite(LED_PIN, LOW);
        delay(250);
    }


    for (int i = 0; i < 3; i++) {
        digitalWrite(LED_PIN, HIGH);
        delay(200);
        digitalWrite(LED_PIN, LOW);
        delay(200);
    }
}


#endif
 