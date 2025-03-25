#include <SoftwareSerial.h>

// Pin definitions for TB6612FNG Motor Driver
const int STBY = 10;  // Standby pin
const int AIN1 = 8;   // Motor A input 1
const int AIN2 = 7;   // Motor A input 2
const int PWMA = 5;   // Motor A PWM speed control
const int BIN1 = 4;   // Motor B input 1
const int BIN2 = 9;   // Motor B input 2
const int PWMB = 6;   // Motor B PWM speed control

// Define software serial pins for WiFi module
const int RX_PIN = 2;  // Connect to WiFi TX
const int TX_PIN = 3;  // Connect to WiFi RX

SoftwareSerial wifiSerial(RX_PIN, TX_PIN);

void moveForward() {
    digitalWrite(STBY, HIGH);
    // Motor A
    digitalWrite(AIN1, HIGH);
    digitalWrite(AIN2, LOW);
    // Motor B
    digitalWrite(BIN1, HIGH);
    digitalWrite(BIN2, LOW);
    // Set speed
    analogWrite(PWMA, 200);
    analogWrite(PWMB, 200);
}

void moveBackward() {
    digitalWrite(STBY, HIGH);
    // Motor A
    digitalWrite(AIN1, LOW);
    digitalWrite(AIN2, HIGH);
    // Motor B
    digitalWrite(BIN1, LOW);
    digitalWrite(BIN2, HIGH);
    // Set speed
    analogWrite(PWMA, 200);
    analogWrite(PWMB, 200);
}

void turnLeft() {
    digitalWrite(STBY, HIGH);
    // Motor A forward
    digitalWrite(AIN1, HIGH);
    digitalWrite(AIN2, LOW);
    // Motor B backward
    digitalWrite(BIN1, LOW);
    digitalWrite(BIN2, HIGH);
    // Set speed
    analogWrite(PWMA, 180);
    analogWrite(PWMB, 180);
}

void turnRight() {
    digitalWrite(STBY, HIGH);
    // Motor A backward
    digitalWrite(AIN1, LOW);
    digitalWrite(AIN2, HIGH);
    // Motor B forward
    digitalWrite(BIN1, HIGH);
    digitalWrite(BIN2, LOW);
    // Set speed
    analogWrite(PWMA, 180);
    analogWrite(PWMB, 180);
}

void stopMotors() {
    // Put in standby mode
    digitalWrite(STBY, LOW);
    // Stop both motors
    analogWrite(PWMA, 0);
    analogWrite(PWMB, 0);
}

void setup() {
    Serial.begin(115200);
    wifiSerial.begin(115200);
    
    // Setup motor control pins
    pinMode(STBY, OUTPUT);
    pinMode(PWMA, OUTPUT);
    pinMode(AIN1, OUTPUT);
    pinMode(AIN2, OUTPUT);
    pinMode(PWMB, OUTPUT);
    pinMode(BIN1, OUTPUT);
    pinMode(BIN2, OUTPUT);
    
    // Initially stop motors
    stopMotors();
}

void loop() {
    // Basic serial pass-through for testing
    if (Serial.available()) {
        String command = Serial.readStringUntil('\n');
        
        if (command == "forward") {
            moveForward();
        } else if (command == "backward") {
            moveBackward();
        } else if (command == "left") {
            turnLeft();
        } else if (command == "right") {
            turnRight();
        } else if (command == "stop") {
            stopMotors();
        }
    }
}
