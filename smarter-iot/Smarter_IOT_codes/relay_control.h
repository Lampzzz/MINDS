#ifndef RELAY_CONTROL_H
#define RELAY_CONTROL_H


#include <Arduino.h>
#include <Preferences.h>
#include "wifi_firebase.h"
#include "lcd_display.h"

#define SwitchPin1 2
#define RelayPin1 23

#define RelayPin2 26
#define ButtonPin2 27


#define ButtonPin3 5
#define BUZZER_PIN 4 
#define LED_PIN 0 

#define HOLD_TIME 3000
#define DEBOUNCE_TIME 50 

extern bool buttonPressed;

bool lastSwitchState1 = LOW;
bool lastButtonState1 = LOW;
bool lastButtonState2 = LOW;
bool lastButtonState3 = LOW;
unsigned long lastButtonChange3 = 0;
unsigned long lastSwitchChange1 = 0;
unsigned long lastButtonChange1 = 0;
unsigned long lastButtonChange2 = 0;

static unsigned long button1PressTime = 0;
static bool button1ActionInProgress = false;
static bool resetFlag = false;
static bool holdLock = false;
Preferences preferences;

void inverterState(const String &inverterValue);
void doorState(const String &doorValue);
void initRelays();
void handleSwitch1();
void handleButton1();
void handleButton2();
void sendInverterState(bool state);
void sendDoorLockState(const String &doorState);
void resetRFID(); 
String getStoredRFID();
void saveRFID(String rfid);
void handleRFID(String rfid);
void clearResetFlag();
bool isReset();



void initRelays() {
    pinMode(SwitchPin1, INPUT_PULLUP);
    pinMode(RelayPin1, OUTPUT);

    pinMode(RelayPin2, OUTPUT);
    pinMode(ButtonPin2, INPUT_PULLUP);


pinMode(ButtonPin3, INPUT_PULLUP);

    pinMode(BUZZER_PIN, OUTPUT);
    pinMode(LED_PIN, OUTPUT);

        digitalWrite(RelayPin1, HIGH); 
    digitalWrite(RelayPin2, HIGH); 

    digitalWrite(LED_PIN, LOW); 
    noTone(BUZZER_PIN);   

preferences.begin("rfid_key", false);
  if (preferences.getString("rfidID", "") == "") {
    preferences.putString("rfidID", "");
  }

}




void handleSwitch1() {
    static bool relayState = HIGH; 
    unsigned long currentMillis = millis();
    bool switchState = digitalRead(SwitchPin1);


    if (switchState != lastSwitchState1 && (currentMillis - lastSwitchChange1 > DEBOUNCE_TIME)) {
        lastSwitchChange1 = currentMillis;  
        if (switchState == LOW) {
            
            relayState = !relayState;

            
            digitalWrite(RelayPin1, relayState);

    
            if (relayState == LOW) {
                
                sendInverterState(true);
            } else {
                
                sendInverterState(false);
            }
        }

        lastSwitchState1 = switchState;



    }
}

void inverterState(const String &inverterValue){

    static bool relayState = HIGH; 

    if (inverterValue == "on") {

        relayState = LOW; 
        digitalWrite(RelayPin1, relayState);
   
    } else if (inverterValue == "off") {

        relayState = HIGH; 
        digitalWrite(RelayPin1, relayState);

    } else {

    }



}




String getStoredRFID() {
  return preferences.getString("rfidID", "");
}


void handleButton1() {
    unsigned long currentMillis = millis();
    bool buttonState = digitalRead(ButtonPin3);


    if (buttonState != lastButtonState3 && (currentMillis - lastButtonChange3 > DEBOUNCE_TIME)) {
        lastButtonChange3 = currentMillis;
        lastButtonState3 = buttonState;

        if (buttonState == LOW) {
           Serial.println("[DEBUG] Button 1 Pressed - Starting action");
            button1PressTime = currentMillis;
            button1ActionInProgress = true;
 buttonPressed = true;
  
           
        }
    }

    if (button1ActionInProgress) {

        if (buttonState == LOW && currentMillis - button1PressTime >= HOLD_TIME) {
          holdLock = true;


 if (!resetFlag) { 
                Serial.println("[RelayControl] Button 1: Hold detected - Resetting RFID");
                lcd2.clear();
  lcd2.setCursor(0, 0);
  lcd2.print("Hold detected - Resetting RFID");
                resetRFID();
                resetFlag = true;

                                    digitalWrite(LED_PIN, HIGH);
        tone(BUZZER_PIN, 1500); 
        delay(300); 
        noTone(BUZZER_PIN); 
        delay(100);
        tone(BUZZER_PIN, 1500);
        delay(300);
        noTone(BUZZER_PIN);
            }


        }

     
        else if (buttonState == HIGH) {
            if ((currentMillis - button1PressTime) < HOLD_TIME) { 
                Serial.println("[RelayControl] Button 1: Click detected - Opening door");
                               lcd2.clear();
  lcd2.setCursor(0, 0);
  lcd2.print("click: opening door");
                  digitalWrite(RelayPin2, LOW);
            sendDoorLockState("open");
         digitalWrite(LED_PIN, HIGH);

 tone(BUZZER_PIN, 1500); 
        delay(300); 
        noTone(BUZZER_PIN); 
        delay(100);
        tone(BUZZER_PIN, 1500);
        delay(300);
        noTone(BUZZER_PIN);

            delay(500); 
            digitalWrite(LED_PIN, LOW);

            Serial.println("Button 1: Door opened");
            }

            
            button1ActionInProgress = false;
            buttonPressed = false;
            
            holdLock = false;
        }
    


    }
}


void doorState(const String &doorValue) {
  if (doorValue == "open") {
    digitalWrite(RelayPin2, LOW);
    tone(BUZZER_PIN, 1000);
    digitalWrite(LED_PIN, HIGH);
    delay(1000);
    noTone(BUZZER_PIN);
    digitalWrite(LED_PIN, LOW);
    delay(5000);
    digitalWrite(RelayPin2, HIGH);
    sendDoorLockState("close");
  }
}



void handleButton2() {
    unsigned long currentMillis = millis();
    bool buttonState = digitalRead(ButtonPin2);
    if (buttonState != lastButtonState2 && (currentMillis - lastButtonChange2 > DEBOUNCE_TIME)) {
        lastButtonChange2 = currentMillis;  
        buttonPressed = true;

        
        if (buttonState == LOW) {
            Serial.println("Button 2 Pressed! Turning Relay 3 ON");
            
        } else {
            Serial.println("Button 2 Released! Turning Relay 3 OFF");
            
        }

        
        lastButtonState2 = buttonState;
    }
}




void resetRFID() {
    String newKeyCardId = preferences.getString("rfidID", "");
    

    if (newKeyCardId == "") {
        
        return;
    }

        if (!checkRFID(newKeyCardId)) { 
                       lcd2.clear();
  lcd2.setCursor(0, 0);
  lcd2.print("[error] Keycard already registered!");
        return;
    }


      lcd2.setCursor(0, 0);
  lcd2.print("[SUCCESS] RFID data reset.");

  tone(BUZZER_PIN, 1000);  
    digitalWrite(LED_PIN, HIGH);
    delay(500);
    noTone(BUZZER_PIN);
    digitalWrite(LED_PIN, LOW);
    resetFlag = true;
}

void handleRFID(String rfid) {
    

    if (resetFlag) { 
        if (rfid != "") {
          
            if (checkRFID(rfid)) {
              
                saveRFID(rfid);
                saveToFirestore(rfid);
                resetFlag = false; 

               lcd2.clear();
  lcd2.setCursor(0, 0);
  lcd2.print("New RFID saved: "+rfid);
                tone(BUZZER_PIN, 1500); 
                digitalWrite(LED_PIN, HIGH);
                delay(500);
                noTone(BUZZER_PIN);
                digitalWrite(LED_PIN, LOW);
            } else {
   

                tone(BUZZER_PIN, 500); 
                digitalWrite(LED_PIN, HIGH);
                delay(500);
                noTone(BUZZER_PIN);
                digitalWrite(LED_PIN, LOW);

            }
        } else {
           
        }
    } else {
     
    }
}

void saveRFID(String rfid) {

    if (rfid != "") {
        preferences.putString("rfidID", rfid);
        Serial.println("[RelayControl] RFID saved: " + rfid);
    } else {
        Serial.println("[RelayControl] Invalid RFID. Skipping save.");
    }
}



bool isReset() {
    return resetFlag;
}

void clearResetFlag() {
    Serial.println("[DEBUG] Clearing reset flag");
    resetFlag = false;
}


#endif