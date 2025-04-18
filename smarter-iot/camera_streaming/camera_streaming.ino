#include "esp_camera.h"
#include <WiFi.h>
#include <WebServer.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <time.h>


const char* ssid = "smarter";
const char* password = "paulramirez";


const char* firebase_project_id = "smarter-b2908";
const char* firebase_api_key = "AIzaSyB6xelReDA6YXzLl4K29VPfvnDGRIuZkDk";
const char* firebase_email = "sample@gmail.com";
const char* firebase_password = "sample";
String firebase_id_token = "";


WebServer server(80);


#define CAMERA_MODEL_AI_THINKER
#define PWDN_GPIO_NUM  32
#define RESET_GPIO_NUM -1
#define XCLK_GPIO_NUM  0
#define SIOD_GPIO_NUM  26
#define SIOC_GPIO_NUM  27

#define Y9_GPIO_NUM    35
#define Y8_GPIO_NUM    34
#define Y7_GPIO_NUM    39
#define Y6_GPIO_NUM    36
#define Y5_GPIO_NUM    21
#define Y4_GPIO_NUM    19
#define Y3_GPIO_NUM    18
#define Y2_GPIO_NUM    5
#define VSYNC_GPIO_NUM 25
#define HREF_GPIO_NUM  23
#define PCLK_GPIO_NUM  22

void setupCamera() {
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_QVGA;
  config.jpeg_quality = 10;
  config.fb_count = 1;

  if (esp_camera_init(&config) != ESP_OK) {
    Serial.println("❌ Camera initialization failed!");
    return;
  }
  Serial.println("✅ Camera initialized successfully!");

  sensor_t *s = esp_camera_sensor_get();
  s->set_vflip(s, 1);  
  s->set_hmirror(s, 1); 
}


String getTimestamp() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    return "";  
  }

  char buffer[50];
  strftime(buffer, sizeof(buffer), "%B %d, %Y at %I:%M:%S %p UTC+8", &timeinfo);
  return String(buffer);
}


void setupTime() {
  configTime(28800, 0, "time.google.com", "time.nist.gov");
  Serial.print("⏳ Syncing time...");
  delay(3000);

  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("❌ Failed to obtain time");
    return;
  }
  Serial.println("✅ Time Synced!");
}

// 🔹 Firebase Authentication
String getFirebaseToken() {
  WiFiClientSecure client;
  client.setInsecure();
  client.setTimeout(5000);

  HTTPClient http;
  String authUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + String(firebase_api_key);

  StaticJsonDocument<200> doc;
  doc["email"] = firebase_email;
  doc["password"] = firebase_password;
  doc["returnSecureToken"] = true;

  String requestBody;
  serializeJson(doc, requestBody);

  http.begin(client, authUrl);
  http.addHeader("Content-Type", "application/json");
  int httpResponseCode = http.POST(requestBody);

  String payload = http.getString();
  http.end();

  if (httpResponseCode == 200) {
    StaticJsonDocument<500> responseDoc;
    deserializeJson(responseDoc, payload);
    return responseDoc["idToken"].as<String>();
  } else {
    Serial.println("❌ Firebase authentication failed!");
    return "";
  }
}


void sendStreamURLToFirestore(String streamURL) {
  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient http;

  String documentID = "cameraUrl";
  String firestoreUrl = "https://firestore.googleapis.com/v1/projects/" +
                         String(firebase_project_id) +
                         "/databases/(default)/documents/ipcam/" + documentID;

  StaticJsonDocument<300> doc;
  JsonObject fields = doc.createNestedObject("fields");
  fields["camera_url"]["stringValue"] = streamURL;
  fields["timestamp"]["stringValue"] = getTimestamp();  

  String requestBody;
  serializeJson(doc, requestBody);

  http.begin(client, firestoreUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + firebase_id_token);

  int httpResponseCode = http.PATCH(requestBody);
  http.end();

  if (httpResponseCode == 200) {
    Serial.println("✅ Stream URL stored in Firestore!");
  } else {
    Serial.println("❌ Error storing Stream URL.");
  }
}


void handleStream() {
  WiFiClient client = server.client();
  client.print("HTTP/1.1 200 OK\r\n");
  client.print("Content-Type: multipart/x-mixed-replace; boundary=frame\r\n\r\n");

  while (client.connected()) {
    camera_fb_t *fb = esp_camera_fb_get();
    if (!fb) {
      Serial.println("❌ Camera capture failed");
      break;
    }

    client.printf("--frame\r\n");
    client.printf("Content-Type: image/jpeg\r\n");
    client.printf("Content-Length: %d\r\n\r\n", fb->len);
    client.write(fb->buf, fb->len);
    client.printf("\r\n");

    esp_camera_fb_return(fb);
    delay(30);  
  }
}


void handleRoot() {
  server.send(200, "text/html", R"rawliteral(
    <!DOCTYPE html>
    <html>
    <head>
      <title>SmarTer Camera</title>
      <style>
        body { text-align: center; font-family: Arial, sans-serif; }
        img { width: 100%; max-width: 640px; border: 2px solid black; }
      </style>
    </head>
    <body>
      <h1>Occupant Monitoring</h1>
      <img src="/stream" id="videoFeed">
    </body>
    </html>
  )rawliteral");
}


void setup() {
  Serial.begin(115200);
  Serial.println("🚀 Starting ESP32-CAM...");

  setupCamera();

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
  }
  Serial.println("✅ Connected to WiFi!");

  setupTime();

  firebase_id_token = getFirebaseToken();
  if (firebase_id_token == "") {
    return;
  }

  String streamURL = "http://" + WiFi.localIP().toString() + "/stream";
  sendStreamURLToFirestore(streamURL);

  server.on("/", handleRoot);
  server.on("/stream", handleStream);
  server.begin();
}


void loop() {
  server.handleClient();
}
