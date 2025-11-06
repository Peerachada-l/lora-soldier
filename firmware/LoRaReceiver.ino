#include <SPI.h>
#include <LoRa.h>

#define SS 5
#define RST 14
#define DIO0 4

#define LED 2

unsigned long lastBlink = 0;
bool ledState = false;

void setup() {
  Serial.begin(115200);
  while (!Serial);

  SPI.begin();
  pinMode(SS, OUTPUT);
  digitalWrite(SS, HIGH);

  Serial.print("Reading SX1278 version...");
  digitalWrite(SS, LOW);
  SPI.transfer(0x42 & 0x7F);
  uint8_t version = SPI.transfer(0x00);
  digitalWrite(SS, HIGH);

  Serial.print("version = 0x");
  Serial.println(version, HEX);

  Serial.println("LoRa Receiver");

  LoRa.setPins(SS, RST, DIO0);

  pinMode(LED, OUTPUT);

  if (!LoRa.begin(433E6)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }

  LoRa.setSpreadingFactor(7);
  Serial.println("LoRa init succeeded!");
  Serial.println();
}

void loop() {

  if (millis() - lastBlink >= 500) {
    ledState = !ledState;
    digitalWrite(LED, ledState);
    lastBlink = millis();
  }

  // try to parse packet
  int packetSize = LoRa.parsePacket();
  if (packetSize) {
    // received a packet
    Serial.print("Received packet '");

    // read packet
    while (LoRa.available()) {
      Serial.print((char)LoRa.read());
    }

    // print RSSI of packet
    Serial.print("' with RSSI ");
    Serial.println(LoRa.packetRssi());

  }
}
