#ifndef LCD_DISPLAY_H
#define LCD_DISPLAY_H

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define BUTTON_PIN 21
#define BUZZER_PIN 4  
#define LED_PIN 0

#define DEBOUNCE_TIME 50


LiquidCrystal_I2C lcd1(0x27, 16, 2);
LiquidCrystal_I2C lcd2(0x26, 20, 4);

int displayMode = 0;
const int totalModes = 7;
extern bool buttonLcdPressed; 

bool lastButtonStateLcd = LOW;

unsigned long lastButtonChangeLcd = 0;


void initLCD() {
 lcd1.begin();
    lcd1.backlight();
    lcd1.clear();
    lcd1.print("LCD1 Initialized");

    lcd2.begin();
    lcd2.backlight();
    lcd2.clear();
    lcd2.print("LCD2 Initialized");
 pinMode(BUTTON_PIN, INPUT_PULLUP);

}

void displayBodyTempOnSecondLCD(float temperature) {
    lcd2.clear();
    lcd2.setCursor(0, 0);
    lcd2.print("Body Temperature:");
    lcd2.setCursor(5, 2);
    lcd2.print(temperature);
    lcd2.print(" C");
}



void displayAnnouncement(String latestAnnouncement) {
    static unsigned long lastScrollTime = 0;
    static unsigned long startTime = 0;
    static int scrollIndex = 0;
    static String prevAnnouncement = "";  
static bool showComplete = false;

    int maxWidth = 20;  
    int maxRows = 4;    
    int textLength = latestAnnouncement.length();

    static String lines[50];   
    static int totalLines = 0; 
    if (latestAnnouncement != prevAnnouncement) {
        totalLines = 0;  
        scrollIndex = 0;  
        prevAnnouncement = latestAnnouncement;
showComplete = false;

startTime = millis();
 if (textLength > 0) {




        int start = 0;  
        while (start < textLength) {
            int end = start + maxWidth;
            if (end >= textLength) {
                lines[totalLines++] = latestAnnouncement.substring(start); 
                break;
            }

            
            int lastSpace = latestAnnouncement.lastIndexOf(' ', end);
            if (lastSpace < start) lastSpace = end; 
            
            lines[totalLines++] = latestAnnouncement.substring(start, lastSpace);
            start = lastSpace + 1; 
            if (totalLines >= 50) break;
        }

    }
    }
    
        if (totalLines == 0) {
        lcd2.clear();
        lcd2.setCursor(0, 0);
        lcd2.print("No Announcement"); 
        return;
    }

    
    if (millis() - lastScrollTime > 2000) {
        lastScrollTime = millis();
        lcd2.clear();

        for (int row = 0; row < maxRows; row++) {
            int lineIndex = (scrollIndex + row) % totalLines; 
            lcd2.setCursor(0, row);
            lcd2.print(lines[lineIndex]);
        }

        scrollIndex = (scrollIndex + 1) % totalLines; 
    }
    if (!showComplete && millis() - startTime > 500) {  
    showComplete = true; 
    for (int i = 0; i < 3; i++) {
        digitalWrite(LED_PIN, HIGH);
        tone(BUZZER_PIN, 1500); 
        delay(100);
        noTone(BUZZER_PIN);
        digitalWrite(LED_PIN, LOW);
        delay(100);
    }
    

    for (int i = 0; i < 4; i++) {
        digitalWrite(LED_PIN, HIGH);
        tone(BUZZER_PIN, 1000); 
        delay(300);
        digitalWrite(LED_PIN, LOW);
        noTone(BUZZER_PIN);
        delay(300);
    }

    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, 1200); 
    delay(1000);
    digitalWrite(LED_PIN, LOW);
    noTone(BUZZER_PIN);
}
}




void displayBodyTemp(float temperature) {
    lcd1.clear();
    lcd1.setCursor(0, 0);
    lcd1.print("Body Temp:");
    lcd1.setCursor(0, 1);
    lcd1.print(temperature);
    lcd1.print(" C");

    
}


void displayAmbientTemp(float ambientTemp) {
    lcd1.clear();
    lcd1.setCursor(0, 0);
    lcd1.print("Room Temp:");
    lcd1.setCursor(0, 1);
    lcd1.print(ambientTemp);
    lcd1.print(" C");
}

void displayRemainingTime(String remainingUsageTime) {
    lcd1.clear();
    lcd1.setCursor(0, 0);
    lcd1.print("Battery Life:");
    lcd1.setCursor(0, 1);
    lcd1.print(remainingUsageTime);
}

void displayBatteryPercentage(float batteryPercentage) {
    lcd1.clear();
    lcd1.setCursor(0, 0);
    lcd1.print("Battery Health:");
    lcd1.setCursor(0, 1);
    lcd1.print(batteryPercentage);
    lcd1.print("%");
}

void displayHumidity(float humidity) {
    lcd1.clear();
    lcd1.setCursor(0, 0);
    lcd1.print("Humidity:");
    lcd1.setCursor(0, 1);
    lcd1.print(humidity);
    lcd1.print("%");
}

void displayAirQuality(float airQuality) {
    lcd1.clear();
    lcd1.setCursor(0, 0);
    lcd1.print("Air Quality:");
    lcd1.setCursor(0, 1);
    lcd1.print(airQuality);
    lcd1.print("%");
}

void displayGasReadings(float mq6, float mq9) {
    lcd1.clear();
    lcd1.setCursor(0, 0);
    lcd1.print("MQ6:");
    lcd1.print(mq6);
    lcd1.setCursor(0, 1);
    lcd1.print("MQ9:");
    lcd1.print(mq9);
}

void handleButtonPress() {


  
    unsigned long currentMillis = millis();
    bool buttonState = digitalRead(BUTTON_PIN);



    
    if (buttonState != lastButtonStateLcd && (currentMillis - lastButtonChangeLcd > DEBOUNCE_TIME)) {
        lastButtonChangeLcd = currentMillis;  

        
        if (buttonState == LOW) {
            
 

                        displayMode = (displayMode + 1) % 7; 
                        Serial.println("[LCD_DEBUG] Button pressed - Switching to displayMode: " + String(displayMode));
        } else{
          Serial.println("[LCD_DEBUG] Button released");
        }

        
       lastButtonStateLcd = buttonState;

        

    }


}

void updateDisplay(float batteryPercentage, String remainingUsageTime, float objectTemp, float ambientTemp, float humidity, float airQuality, float mq6, float mq9) {
    handleButtonPress();
lcd2.clear(); 
  Serial.print("[LCD_DEBUG] Updating display for mode: ");

    
    switch (displayMode) {
        case 0:
            displayBodyTemp(objectTemp);
            break;
        case 1:
            displayAmbientTemp(ambientTemp);
            break;
        case 2:
            displayRemainingTime(remainingUsageTime);
            break;
        case 3:
            displayBatteryPercentage(batteryPercentage);
            break;
        case 4:
            displayHumidity(humidity);
            break;
        case 5:
            displayAirQuality(airQuality);
            break;
        case 6:
            displayGasReadings(mq6, mq9);
            break;
    }
}



void getAddress(){
  byte error, address; 
  int devicecount;

  Serial.println("Scanning...");

  devicecount = 0;
  for (address = 1; address < 127; address++ )
  {

    Wire.beginTransmission(address);
    error = Wire.endTransmission();

    if (error == 0)
    {
      Serial.print("I2C device found at address 0x");
      if (address < 16)
        Serial.print("0");
      Serial.print(address, HEX);
      Serial.println("  !");
      devicecount++;
    }
    else if (error == 4)
    {
      Serial.print("Unknown error at address 0x");
      if (address < 16)
        Serial.print("0");
      Serial.println(address, HEX);
    }
  }
  if (devicecount == 0)
    Serial.println("No I2C devices found\n");
  else
    Serial.println("done\n");

  delay(5000); 
}
#endif
