#ifndef WIFI_FIREBASE_H
#define WIFI_FIREBASE_H

#include <Arduino.h>
#include <WiFi.h>
#include <ArduinoJson.h>

#include <ArduinoOTA.h>
#include <Firebase_ESP_Client.h> 
#include <Preferences.h>

#include <addons/TokenHelper.h>
#include <time.h>
#include <ctime>



#include "power_management.h"
#include "door_lock.h"
#include "relay_control.h"
#include "lcd_display.h"



#define WIFI_SSID "smarter"
#define WIFI_PASSWORD "paulramirez"



#define API_KEY "AIzaSyB6xelReDA6YXzLl4K29VPfvnDGRIuZkDk"
#define FIREBASE_PROJECT_ID "smarter-b2908"
#define DATABASE_URL "https://smarter-b2908-default-rtdb.firebaseio.com/"

#define USER_EMAIL "sample@gmail.com"
#define USER_PASSWORD "sample"

const char* ntpServer = "time.google.com"; 
const long gmtOffset_sec = 28800; 
const int daylightOffset_sec = 0;

const unsigned long sendDataInterval = 5000;

#define TIME_THRESHOLD 600
#define TIME_THRESHOLD_MINUTES 5
extern String inverterValue;
extern String inverterTimestamp;

extern String doorValue;
extern String doorTimestamp;

extern String displayAccess;
extern String tempTimestamp;
extern Preferences preferences;
extern bool wifiConnected;

bool isShelterDocumentCreated = false;
FirebaseData fbdo;
FirebaseAuth auth; 
FirebaseConfig config;
unsigned long sendDataPrevMillis = 0;


String name = "shelter 01";
String keyCardId = "";


String shelterDeviceId = "";

String latestAnnouncement = "";

int shelterNo = 1;


#define QUEUE_SIZE 10
struct DataQueueEntry {
  String jsonData;
  String path;
  bool used;
};
extern DataQueueEntry dataQueue[QUEUE_SIZE];
extern int queueIndex;
bool firebaseInitialized = false;

void checkWiFiStatus(); 
void queueData(String path, FirebaseJson &json); 
void syncQueuedData();


void initWiFiAndFirebase() {
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  lcd2.clear();
  lcd2.setCursor(0, 0);
  lcd2.print("Wi-Fi Connecting");
  Serial.println("Connecting to Wi-Fi");

  
  config.api_key = API_KEY;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.token_status_callback = tokenStatusCallback;

  
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  Serial.println("WiFi Setup Complete"); 
}

void initializeFirebase() {
  if (!firebaseInitialized && WiFi.status() == WL_CONNECTED) {
    Serial.println("Initializing Firebase...");
    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);
    firebaseInitialized = true;
    Serial.println("Firebase Initialized");
  }
}
void checkWiFiStatus() {
  static unsigned long lastCheck = 0;
  const unsigned long checkInterval = 5000; 

  if (millis() - lastCheck >= checkInterval) {
    lastCheck = millis();
    if (WiFi.status() == WL_CONNECTED) {
      if (!wifiConnected) {
        wifiConnected = true;
        Serial.println("Wi-Fi Connected: " + WiFi.localIP().toString());
        lcd2.clear();
        lcd2.setCursor(0, 0);
        lcd2.print("Wi-Fi Connected");
        lcd2.setCursor(0, 1);
        lcd2.print(WiFi.localIP().toString());

       
        struct tm timeinfo;
        int retryCount = 0;
        while (!getLocalTime(&timeinfo) && retryCount < 10) {
          Serial.println("Waiting for NTP time sync...");
          lcd2.clear();
          lcd2.setCursor(0, 0);
          lcd2.print("Time syncing...");
          delay(1000);
          retryCount++;
        }
        if (retryCount < 10) {
          Serial.println("Time synchronized!");
          lcd2.clear();
          lcd2.setCursor(0, 0);
          lcd2.print("Time synchronized!");
          delay(1000);
        } else {
          Serial.println("Failed to obtain time");
          lcd2.clear();
          lcd2.setCursor(0, 0);
          lcd2.print("Time sync failed!");
        }
        initializeFirebase();
      }
    } else {
      if (wifiConnected) {
        wifiConnected = false;
        Serial.println("Wi-Fi Disconnected");
        lcd2.clear();
        lcd2.setCursor(0, 0);
        lcd2.print("Wi-Fi Disconnected");
      }
      WiFi.reconnect(); 
    }
  }
}

void queueData(String path, FirebaseJson &json) {
  if (queueIndex < QUEUE_SIZE) {
    String jsonStr;
    json.toString(jsonStr);
    dataQueue[queueIndex].jsonData = jsonStr;
    dataQueue[queueIndex].path = path;
    dataQueue[queueIndex].used = true;
    queueIndex++;
    Serial.println("Data queued for " + path);
  } else {
    Serial.println("Queue full, discarding data");
  }
}

void syncQueuedData() {
  for (int i = 0; i < queueIndex; i++) {
    if (dataQueue[i].used) {
      if (Firebase.Firestore.createDocument(&fbdo, FIREBASE_PROJECT_ID, "", dataQueue[i].path.c_str(), dataQueue[i].jsonData.c_str())) {
        Serial.println("Synced queued data to " + dataQueue[i].path);
        dataQueue[i].used = false;
      } else {
        Serial.println("Failed to sync: " + fbdo.errorReason());
        break; 
      }
    }
  }
  if (queueIndex > 0 && !dataQueue[0].used) {
    queueIndex = 0; 
  }
}


String getFormattedTime() {
  time_t now;
  struct tm timeinfo;
  char buffer[30];


  time(&now);


 

  gmtime_r(&now, &timeinfo);


strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);


  return String(buffer);
}





bool isWithinThreshold(String retrievedTimestamp) {
    struct tm timeinfo = {0};
    time_t retrievedTime, currentTime;

    
    retrievedTimestamp = retrievedTimestamp.substring(0, 16) + "Z"; 

    int year, month, day, hour, minute;
    
   
    if (sscanf(retrievedTimestamp.c_str(), "%d-%d-%dT%d:%d", 
               &year, &month, &day, &hour, &minute) == 5) {
        
        
        timeinfo.tm_year = year - 1900;  
        timeinfo.tm_mon = month - 1;    
        timeinfo.tm_mday = day;
        timeinfo.tm_hour = hour;
        timeinfo.tm_min = minute;
        timeinfo.tm_sec = 0;    
        timeinfo.tm_isdst = 0; 
        setenv("TZ", "UTC", 1);
        tzset();

        retrievedTime = mktime(&timeinfo); 
        time(&currentTime);
        struct tm current_tm;
        gmtime_r(&currentTime, &current_tm);  
        current_tm.tm_sec = 0;
        time_t current_no_sec = mktime(&current_tm);  
        double diffMinutes = difftime(current_no_sec, retrievedTime) / 60.0;



        return diffMinutes <= TIME_THRESHOLD_MINUTES;
    }

    Serial.println("❌ Failed to parse timestamp!");
    return false;
}

void sendThresholdAlert(const char* sensor, bool state) {
  String collectionPath = "thresholdAlerts";
  FirebaseJson json;

  json.set("fields/sensor/stringValue", sensor);
  json.set("fields/state/booleanValue", state);
  json.set("fields/createdAt/timestampValue", getFormattedTime());

  if (Firebase.Firestore.createDocument(&fbdo, FIREBASE_PROJECT_ID, "", collectionPath.c_str(), json.raw())) {
    Serial.println("[SUCCESS] Threshold alert saved to Firestore for " + String(sensor));
  } else {
    Serial.print("[ERROR] Failed to save threshold alert for ");
    Serial.print(sensor);
    Serial.print(": ");
    Serial.println(fbdo.errorReason());
  }
}
void saveToFirestore(String rfid) {
    
    String collectionPath = "shelterDevices";
    int highestShelterNo = 0;

    if (Firebase.Firestore.getDocument(&fbdo, FIREBASE_PROJECT_ID, "", collectionPath.c_str())) {
        

        DynamicJsonDocument doc(4096);
        DeserializationError error = deserializeJson(doc, fbdo.payload().c_str());
        if (error) {
            Serial.println("[ERROR] Failed to parse JSON: " + String(error.c_str()));
            return;
        }

        if (doc.containsKey("documents")) {
            JsonArray documents = doc["documents"].as<JsonArray>();
            for (JsonVariant docItem : documents) {
                int shelterNoValue = docItem["fields"]["shelterNo"]["integerValue"].as<int>();
                if (shelterNoValue > highestShelterNo) {
                    highestShelterNo = shelterNoValue;
                }
            }
        }
    } else {
        Serial.print("[ERROR] Failed to retrieve data from Firestore: ");
        Serial.println(fbdo.errorReason());
    }

    
    shelterNo = highestShelterNo + 1;
    Serial.println("[DEBUG] New shelterNo: " + String(shelterNo));

    
    FirebaseJson json;
    
    
    json.set("fields/keyCardId/stringValue", rfid);

    
    String timestamp = getFormattedTime(); 
    json.set("fields/createdAt/timestampValue", timestamp);

    
    json.set("fields/shelterNo/integerValue", String(shelterNo));

    
    json.set("fields/isRegistered/booleanValue", "false");

    
json.set("fields/cameraUrl/stringValue", "");

    if (Firebase.Firestore.createDocument(&fbdo, FIREBASE_PROJECT_ID, "", collectionPath.c_str(), json.raw())) {
        Serial.println("[SUCCESS] Keycard saved to Firestore");
    } else {
        Serial.print("[ERROR] Failed to save to Firestore: ");
        Serial.println(fbdo.errorReason());
    }
}

bool checkRFID(String newKeyCardId) {
    Serial.println("[DEBUG] Starting checkRFID() for keycard: " + newKeyCardId);

    String collectionPath = "shelterDevices";
    if (Firebase.Firestore.getDocument(&fbdo, FIREBASE_PROJECT_ID, "", collectionPath.c_str())) {
        Serial.println("[DEBUG] Firestore request successful");

        DynamicJsonDocument doc(4096);
        DeserializationError error = deserializeJson(doc, fbdo.payload().c_str());
        if (error) {
            Serial.println("[ERROR] Failed to parse JSON: " + String(error.c_str()));
            return false;
        }

        if (!doc.containsKey("documents")) {
            Serial.println("[DEBUG] No shelter devices found");
            return true; 
        }

        JsonArray documents = doc["documents"].as<JsonArray>();
        for (JsonVariant docItem : documents) {
            String keycard = docItem["fields"]["keyCardId"]["stringValue"].as<String>();
            bool isRegistered = docItem["fields"]["isRegistered"]["booleanValue"].as<bool>();
            


            Serial.println("[DEBUG] Found keycard: " + keycard + " | Registered: " + String(isRegistered));
            
            if (keycard == newKeyCardId) {

              
                Serial.println("[ERROR] Keycard already registered!");
                return false;
            }
        }
Serial.println("[DEBUG] Keycard not found — registration allowed");
        return true;
    } else {
        Serial.println("[ERROR] Failed to retrieve data from Firestore");
        Serial.println("[DEBUG] Firebase Error: " + fbdo.errorReason());
        return false;
    }
}


void readAndSaveDocumentId() {
    String storedKeyCardId = preferences.getString("rfidID", "");
    if (storedKeyCardId == "") {
        Serial.println("[ERROR] No keycard ID stored in preferences.");
        return;
    }

    Serial.println("[DEBUG] Reading Firestore for keycard: " + storedKeyCardId);

    String collectionPath = "shelterDevices";
    if (Firebase.Firestore.getDocument(&fbdo, FIREBASE_PROJECT_ID, "", collectionPath.c_str())) {
        Serial.println("[DEBUG] Firestore request successful");

        DynamicJsonDocument doc(4096);
        DeserializationError error = deserializeJson(doc, fbdo.payload().c_str());
        if (error) {
            Serial.println("[ERROR] Failed to parse JSON: " + String(error.c_str()));
            return;
        }

        if (!doc.containsKey("documents")) {
            Serial.println("[DEBUG] No shelter devices found");
            return;
        }

        JsonArray documents = doc["documents"].as<JsonArray>();
        for (JsonVariant docItem : documents) {
            String keycard = docItem["fields"]["keyCardId"]["stringValue"].as<String>();
            String fullPath = docItem["name"].as<String>();
            int lastSlashIndex = fullPath.lastIndexOf('/');
            String documentId = fullPath.substring(lastSlashIndex + 1);
            
            if (keycard == storedKeyCardId) {
                shelterDeviceId = documentId; 
                Serial.println("[SUCCESS] Matching document ID: " + shelterDeviceId);
                return;
            }
        }

        Serial.println("[DEBUG] No matching keycard found in Firestore");
    } else {
        Serial.println("[ERROR] Failed to retrieve data from Firestore");
        Serial.println("[DEBUG] Firebase Error: " + fbdo.errorReason());
    }
}






void getLatestAnnouncement() {
    String documentPath = "announcements";  

    

    if (Firebase.Firestore.getDocument(&fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str())) {

      
        DynamicJsonDocument doc(1024);
                DeserializationError error = deserializeJson(doc, fbdo.payload().c_str());
        if (error) {
            Serial.println("Failed to parse JSON");
            return;
        }

        String latestDocID;
        String latestTimestamp;
        String latestDescription;

                if (!doc.containsKey("documents")) {
            
            return;
        }

        
       JsonArray documents = doc["documents"].as<JsonArray>();
        for (JsonVariant docItem : documents) {
            String docID = docItem["name"].as<String>();
            docID = docID.substring(docID.lastIndexOf('/') + 1); 

 String timestampStr = docItem["fields"]["updatedAt"]["timestampValue"].as<String>();
            String description = docItem["fields"]["description"]["stringValue"].as<String>();
            



timestampStr = timestampStr.substring(0, 16) + "Z";

 if (latestTimestamp.isEmpty() || timestampStr > latestTimestamp) {
                latestTimestamp = timestampStr;
                latestDocID = docID;
                latestDescription = description;
            }
        }


        if (latestDocID.length() > 0) {
  

            latestAnnouncement = latestDescription;  
        } else {
            Serial.println("No announcements found.");
        }
    } else {
        Serial.println("Error fetching data: " + fbdo.errorReason());
    }
}




void createAnalyticsValue(float airQualityPercentage, float mq6, float mq9, float humidity, float ambientTemp,
                          float objectTemp, float batteryPercentage, String remainingUsageTime){
  
String timestamp = getFormattedTime();
String shelterId = shelterDeviceId.isEmpty() ? "" : shelterDeviceId;
int occupied = 0;




String documentPath = "analytics/" ;

FirebaseJson json;




        json.set("fields/humidity/stringValue", String(humidity, 2));
        json.set("fields/shelterTemperature/stringValue", String(ambientTemp, 2));
        json.set("fields/airQuality/stringValue", String(airQualityPercentage, 2));
       json.set("fields/objectTemperature/stringValue", String(objectTemp, 2));
        json.set("fields/batteryPercentage/stringValue", String(batteryPercentage, 2));
        json.set("fields/batteryRemainingUsageTime/stringValue", String(remainingUsageTime));
        json.set("fields/createdAt/timestampValue", getFormattedTime());
 

            json.set("fields/shelterDeviceId/stringValue", shelterId);

if (Firebase.Firestore.createDocument(&fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str(), json.raw())) 
  {
    
} else {
    Serial.println(fbdo.errorReason());
}

}



void sendInverterState(bool inverterState) {
    if (wifiConnected) {
  String shelterId = shelterDeviceId;
  String documentPath = "controllers/inverter"; 
  String timestamp = getFormattedTime();
  FirebaseJson json;
  json.set("fields/status/stringValue", inverterState ? "on" : "off");
  json.set("fields/timestamp/timestampValue", timestamp);
  json.set("fields/shelterDeviceId/stringValue", shelterId);


if (Firebase.Firestore.patchDocument(&fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str(), json.raw(),"")) {
       
        } else {
            Serial.println(fbdo.errorReason());
        }


}
}
 void sendDoorLockState(const String &doorState) {
    if (wifiConnected) {
  String shelterId = shelterDeviceId;
  String documentPath = "controllers/door"; 
    if (String(FIREBASE_PROJECT_ID).isEmpty() || documentPath.isEmpty()) {
        Serial.println("Invalid project ID or document path");
        return;
    }
  FirebaseJson json;
  json.set("fields/status/stringValue", doorState);
  json.set("fields/timestamp/timestampValue", getFormattedTime());
  json.set("fields/shelterDeviceId/stringValue", shelterId);

    String jsonData;
    json.toString(jsonData, false);
    if (jsonData.isEmpty()) {
        Serial.println("[ERROR] JSON data is empty");
        return;
    }


if (Firebase.Firestore.patchDocument(&fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str(), jsonData.c_str(),"")) {
         
        } else {
            Serial.println(fbdo.errorReason());
        }

fbdo.clear();
}
 }





void getDeviceState() {
    String shelterId = shelterDeviceId;
    
    String documentPath = "controllers/inverter" ; 
    String docsPath = "controllers/door";
    String tempPath = "controllers/bodyTempAccess";
    static String lastTimestamp = ""; 


    

    
    if (Firebase.Firestore.getDocument(&fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str())) {
        

        FirebaseJson jsonData;
        FirebaseJsonData jsonDataValue;

        
        jsonData.setJsonData(fbdo.payload().c_str());

        
        if (jsonData.get(jsonDataValue, "fields/timestamp/timestampValue")) {
             inverterTimestamp = jsonDataValue.to<String>(); 
              Serial.println(inverterTimestamp);
            
 String currentTimestamp = getFormattedTime();
                Serial.printf("New update detected. Timestamp: %s\n", currentTimestamp.c_str());
                 

            if (isWithinThreshold(inverterTimestamp)) {
                Serial.println("✅ Timestamp is within 10 minutes.");
                
                if (jsonData.get(jsonDataValue, "fields/status/stringValue")) {
                     inverterValue = jsonDataValue.to<String>(); 
         Serial.println("Inverter Value: " + inverterValue);

                    

                } else {
                    Serial.printf("Error retrieving inverter value: %s\n", fbdo.errorReason().c_str());
                }

            } else {
                Serial.println("❌ Timestamp is too old.");
               
            }


        } else {
            Serial.printf("Error retrieving timestamp value for inverter: %s\n", fbdo.errorReason().c_str());
        }
    } else {
        
        Serial.printf("Error retrieving document: %s\n", fbdo.errorReason().c_str());
    }



if (Firebase.Firestore.getDocument(&fbdo, FIREBASE_PROJECT_ID, "", docsPath.c_str())) {
        

        FirebaseJson jsonData;
        FirebaseJsonData jsonDataValue;

       
        jsonData.setJsonData(fbdo.payload().c_str());

        
        if (jsonData.get(jsonDataValue, "fields/timestamp/timestampValue")) {
             doorTimestamp = jsonDataValue.to<String>(); 


            if (isWithinThreshold(doorTimestamp)) {
                Serial.println("✅ Timestamp is within 10 minutes.");

               
                if (jsonData.get(jsonDataValue, "fields/status/stringValue")) {
                     doorValue = jsonDataValue.to<String>(); 
                    Serial.printf("door value: %s\n", doorValue.c_str());

                    

                } else {
                    Serial.printf("Error retrieving inverter value: %s\n", fbdo.errorReason().c_str());
                }



            } else {
                
                doorValue = "close";
            }



        } else {
            Serial.printf("Error retrieving timestamp value for door: %s\n", fbdo.errorReason().c_str());
        }
    } else {
     
        Serial.printf("Error retrieving document: %s\n", fbdo.errorReason().c_str());
    }

















}






void updateControllers(float mq6, float mq9, float humidity, float ambientTemp,
                          float objectTemp, float batteryPercentage, String remainingUsageTime){
  
String timestamp = getFormattedTime();
String shelterId = "W2dCoxpcsdSaGYs8tUr6";
int occupied = 0;




String documentPath = "metrics/" ;

FirebaseJson json;

        json.set("fields/methaneLevel/stringValue", String(mq6, 2)); 
        json.set("fields/carbonMonoxideLevel/stringValue", String(mq9, 2));
        json.set("fields/humidity/stringValue", String(humidity, 2));
        json.set("fields/shelterTemperature/stringValue", String(ambientTemp, 2));
         json.set("fields/residentTemperature/stringValue", String(objectTemp, 2));
        json.set("fields/batteryPercentage/stringValue", String(batteryPercentage, 2));
        json.set("fields/remainingUsageTime/stringValue", String(remainingUsageTime));
        json.set("fields/timestamp/stringValue", timestamp);
        json.set("fields/occupied/integerValue", occupied);
        json.set("fields/shelterId/stringValue", String(shelterId));

if (Firebase.Firestore.createDocument(&fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str(), json.raw())) 
  {
    
} else {
    Serial.println(fbdo.errorReason());
}

}




void getPowerManagementData() {
    String sensorDocumentPath = "sensorStatus/powerManagement";

    
    if (Firebase.Firestore.getDocument(&fbdo, FIREBASE_PROJECT_ID, "", sensorDocumentPath.c_str())) {
        

        FirebaseJson jsonData;
        FirebaseJsonData jsonDataValue;

        jsonData.setJsonData(fbdo.payload().c_str());


        if (jsonData.get(jsonDataValue, "fields/energyConsumption/stringValue")) {

             energy = jsonDataValue.stringValue.toFloat();

            
        } else {
            Serial.printf("Error retrieving MQ6 value: %s\n", fbdo.errorReason().c_str());
        }

        if (jsonData.get(jsonDataValue, "fields/runTime/stringValue")) {

            runningTime = jsonDataValue.stringValue.toFloat();

        } else {
            Serial.printf("Error retrieving Temperature value: %s\n", fbdo.errorReason().c_str());
        }




    } else {
        Serial.printf("Error retrieving document: %s\n", fbdo.errorReason().c_str());
    }
}




void getShelterKey() {
    String shelterPath = "shelterDevices/W2dCoxpcsdSaGYs8tUr6";




    if (Firebase.Firestore.getDocument(&fbdo, FIREBASE_PROJECT_ID, "", shelterPath.c_str())) {
        

        FirebaseJson jsonData;
        FirebaseJsonData jsonDataValue;


        jsonData.setJsonData(fbdo.payload().c_str());

        if (jsonData.get(jsonDataValue, "fields/keyCardId/stringValue")) {

            keyCardId = jsonDataValue.stringValue;

            
        } else {
            Serial.printf("Error retrieving MQ6 value: %s\n", fbdo.errorReason().c_str());
        }


    } else {
        Serial.printf("Error retrieving document: %s\n", fbdo.errorReason().c_str());
    }
}


void saveShelterID() {
    String shelterPath = "shelterDevices/W2dCoxpcsdSaGYs8tUr6" ; 


    if (isShelterDocumentCreated) {
        
        return;
    }
   
    if (Firebase.Firestore.getDocument(&fbdo, FIREBASE_PROJECT_ID, "", shelterPath.c_str())) {
        
        return; 

                isShelterDocumentCreated = true; 
        return;
    } 

    Serial.println("Shelter document not found. Creating a new one...");
String jsonPath = "shelterDevices/W2dCoxpcsdSaGYs8tUr6";

    String keyCardId = "9a ea a8 89";
    bool isRegistered = false;




    FirebaseJson metadataJson;

    metadataJson.set("fields/keyCardId/stringValue", keyCardId);
    metadataJson.set("fields/name/stringValue", name);
    metadataJson.set("fields/isRegistered/booleanValue", isRegistered);
    metadataJson.set("fields/createdAt/timestampValue", getFormattedTime());


    if (Firebase.Firestore.createDocument(&fbdo, FIREBASE_PROJECT_ID, "", jsonPath.c_str(), metadataJson.raw())) {

        isShelterDocumentCreated = true; 
    } else {

    }
}


#endif

