#include <SPI.h>
#include <LoRa.h>
#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"

#define SS 5
#define RST 14
#define DIO0 4
#define SDA 21
#define SCL 22

MAX30105 particleSensor;

int counter = 0;
const byte RATE_SIZE = 4;
byte rates[RATE_SIZE];
byte rateSpot = 0;
long lastBeat = 0;
long lastSend = 0;
const unsigned long sendInterval = 5000;


float beatsPerMinute;
int beatAvg;


void setup() {
  Serial.begin(115200);why 
  while (!Serial);

  SPI.begin();
  pinMode(SS, OUTPUT);
  digitalWrite(SS, HIGH);

  Serial.println("Initializing heartbeat sensor....");

  if (!particleSensor.begin(Wire, I2C_SPEED_FAST))
  {
    Serial.println("MAX30105 was not found. Please check wiring/power. ");
    while (1);
  }

  Serial.println("Place your index finger on the sensor with steady pressure.");

  particleSensor.setup(); //Configure sensor with default settings
  particleSensor.setPulseAmplitudeRed(0x0A); //Turn Red LED to low to indicate sensor is running
  particleSensor.setPulseAmplitudeGreen(0); //Turn off Green LED

  Serial.print("Reading SX1278 version...");
  digitalWrite(SS, LOW);
  SPI.transfer(0x42 & 0x7F);
  uint8_t version = SPI.transfer(0x00);
  digitalWrite(SS, HIGH);

  Serial.print("version = 0x");
  Serial.println(version, HEX);

  Serial.println("LoRa Sender");

  LoRa.setPins(SS, RST, DIO0);

  if (!LoRa.begin(433E6)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }
  LoRa.setSpreadingFactor(7);
  Serial.println("LoRa init succeeded!");


}

void loop() {
  long irValue = particleSensor.getIR();

  if (checkForBeat(irValue) == true)
  {
    //We sensed a beat!
    long delta = millis() - lastBeat;
    lastBeat = millis();

    beatsPerMinute = 60 / (delta / 1000.0);

    if (beatsPerMinute < 255 && beatsPerMinute > 20)
    {
      rates[rateSpot++] = (byte)beatsPerMinute; //Store this reading in the array
      rateSpot %= RATE_SIZE; //Wrap variable

      //Take average of readings
      beatAvg = 0;
      for (byte x = 0 ; x < RATE_SIZE ; x++)
        beatAvg += rates[x];
      beatAvg /= RATE_SIZE;
    }
  }

  Serial.print("IR=");
  Serial.print(irValue);
  Serial.print(", BPM=");
  Serial.print(beatsPerMinute);
  Serial.print(", Avg BPM=");
  Serial.print(beatAvg);

  if (irValue < 50000)
    Serial.print(" No finger?");

  Serial.println();

  unsigned long now = millis();

  if (now - lastSend >= sendInterval) {
    lastSend = now;
    Serial.print("Sending packet: ");
  Serial.println(counter);

  LoRa.beginPacket();
  LoRa.print("{IR=");
  LoRa.print(irValue);
  LoRa.print(", BPM=");
  LoRa.print(beatsPerMinute);
  LoRa.print(", Avg BPM=");
  LoRa.print(beatAvg);
  LoRa.print(", counter=");
  LoRa.print(counter);
  LoRa.print("}");
  LoRa.endPacket();

  counter++;
  }
}
