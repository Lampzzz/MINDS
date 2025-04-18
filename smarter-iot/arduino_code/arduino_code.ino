
const int voltageSensorPin = A1;  
const int currentSensorPin = A0;  


float vIn;        
float currentIn;  


const float voltageFactor = 4.5;  
const float vCC = 5.0;            
const float calibrationFactor = 1.145;  
const float sensitivity = 0.1;    
const float calibrationOffset = 2.502; 


void setup() {
  Serial.begin(9600);  
}


void loop() {
  
  vIn = readVoltage();  
  currentIn = readCurrent();  

  


  Serial.print(vIn);  
  Serial.print(",");   
  Serial.println(currentIn);

  delay(1000);  
}


float readVoltage() {
  float totalVoltage = 0;
  int numSamples = 500;  

 
  for (int i = 0; i < numSamples; i++) {
    int voltageSensorVal = analogRead(voltageSensorPin);  

   
    float vOut = (voltageSensorVal / 1023.0) * vCC;  
    
    
    float vIn = vOut * voltageFactor * calibrationFactor;

    
    totalVoltage += vIn;

    delay(1);  
  }

 
  float averageVoltage = totalVoltage / numSamples;  

  return averageVoltage;  
}


float readCurrent() {
  float totalCurrent = 0;
  int numSamples = 500;  

 
  for (int i = 0; i < numSamples; i++) {
    int sensorValue = analogRead(currentSensorPin);  

    
    float voltage = sensorValue * (vCC / 1023.0);
    
    
    float current = (voltage - calibrationOffset) / sensitivity;

   
    totalCurrent += current;

    delay(1);  
  }

  
  float averageCurrent = totalCurrent / numSamples;  

  return averageCurrent;  
}
