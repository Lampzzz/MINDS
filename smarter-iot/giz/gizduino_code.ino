#include <SPI.h>
#include <MFRC522.h>
#include <avr/wdt.h>

#define SS_PIN 10
#define RST_PIN 9

MFRC522 mfrc522(SS_PIN, RST_PIN);

unsigned long lastSendTime = 0;    
const unsigned long SEND_DELAY = 3000; 
void setupHardware() {
   // Buzzer
  SPI.begin(); 
  mfrc522.PCD_Init(); 
  Serial.begin(9600); 
}


void readRFID() {
  if (!mfrc522.PICC_IsNewCardPresent()) return;
  if (!mfrc522.PICC_ReadCardSerial()) return;

  String content = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "));
    content.concat(String(mfrc522.uid.uidByte[i], HEX));
  }

  content.trim(); 

  unsigned long currentTime = millis();
  

  if (currentTime - lastSendTime >= SEND_DELAY) {
    lastSendTime = currentTime;    
    sendData(content);   
    delay(6000);
    resetMicrocontroller();           
  }
}


void sendData(String data) {
  Serial.println(data);  
}

void resetMicrocontroller() {
  
  
  wdt_enable(WDTO_15MS);
  while (1) {}           
}




void setup() {
  setupHardware();
}

void loop() {
  readRFID();  
}
