#include <Arduino.h>
#include <Wifi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <ArduinoJson.hpp>
#include <esp_system.h>

//Net Setup
char net_ssid[] = "LabMicros";
char net_password[] = "seluspeesc@";

//MQTT Setup
#define MQTT_ID "12345"
#define MQTT_BROKER "igbt.eesc.usp.br"
#define MQTT_PORT 1883
#define MQTT_TOPIC1 "/smartlock/sensor_porta"
#define MQTT_TOPIC2 "/smartlock/desbloqueio_porta"
#define MQTT_USERNAME "mqtt"
#define MQTT_PASSWORD "mqtt_123_abc"
#define pinSensorPorta 17
#define pinRele 13
#define id_porta1 
#define id_porta2
WiFiClient espClient;
PubSubClient MQTT(espClient);

long currentTime, lastTime = 0;
bool statusPorta = true;
String macAddress;
char macStr[18]; // Espaço suficiente para o MAC address no formato "XX:XX:XX:XX:XX:XX"

void setupWifi();
void setupMQTT();
void callback(char *topic, byte *payload,unsigned int length);
void topicsSubscribe();
void reconnectWifi();
void reconnectMQTT();
void get_mac_adress();

void setup(){

Serial.begin(9600);

setupWifi();
setupMQTT();

pinMode(pinRele, OUTPUT);
digitalWrite(pinRele,LOW);

pinMode(pinSensorPorta, INPUT);

get_mac_adress();

}

void loop() {
  if(!MQTT.connected())
      reconnectMQTT();

  if(WiFi.status() != WL_CONNECTED)
      reconnectWifi();

  if(statusPorta != digitalRead(pinSensorPorta))
  {
    statusPorta = digitalRead(pinSensorPorta);
    MQTT.publish(MQTT_TOPIC1,macStr);
  }
  
  MQTT.loop();
  delay(500);
}

void get_mac_adress() {
  uint8_t chipid[6];
  esp_efuse_mac_get_default(chipid);

  //char macStr[18]; // Espaço suficiente para o MAC address no formato "XX:XX:XX:XX:XX:XX"
  snprintf(macStr, sizeof(macStr), "%02X:%02X:%02X:%02X:%02X:%02X", chipid[0], chipid[1], chipid[2], chipid[3], chipid[4], chipid[5]);
  macAddress = String(macStr);
}

void setupWifi() {
  //Configura conexão à rede WiFi
  Serial.print("Conectando a ");
  Serial.println(net_ssid);
  if(WiFi.status() == WL_CONNECTED) 
      return;

  WiFi.begin(net_ssid,net_password);
  Serial.print("Conectando a ");
  Serial.println(net_ssid);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.println(".");
  }

  Serial.println(" ");
  Serial.println("WiFi conectado");
  Serial.println("Endereço IP: ");
  Serial.println(WiFi.localIP());
}

void  setupMQTT() {
  //Configura a conexão MQTT
  MQTT.setServer(MQTT_BROKER,MQTT_PORT);
  MQTT.setCallback(callback);

  while (!MQTT.connected())
  {
    Serial.print("Tentando se conectar ao Broker MQTT ");
    Serial.println(MQTT_BROKER);

    if(MQTT.connect(MQTT_ID,MQTT_USERNAME,MQTT_PASSWORD))
    {
      Serial.println("Conectado com sucesso ao Broker MQTT");
      topicsSubscribe();
    }
    else
    {
      Serial.println("Falha ao conectar ao Broker");
      Serial.println("Nova tentativa em 2s");
      delay(2000);
    }
  }
}

void callback(char *topic, byte * payload, unsigned int length){
  String str = "";
  char msgstr[] = "";

  for(int i=0;i<17;i++)
  {
    str += (char)payload[i];
  }

  if(String(topic) == MQTT_TOPIC2)
  {
    if(str == macAddress)
    {
        digitalWrite(pinRele,!digitalRead(pinRele));
	      Serial.print("MAC da Porta ativada: ");
        Serial.println(macAddress);
     }
    else
      {
	      Serial.print("MAC da Porta ativada: ");
        Serial.println(macAddress);
      }
   }
}

void topicsSubscribe(){
  if(MQTT.subscribe(MQTT_TOPIC1))
  {
    Serial.print("Inscrição bem sucedida no tópico: ");
    Serial.println(MQTT_TOPIC1);
  }
  if(MQTT.subscribe(MQTT_TOPIC2))
  {
    Serial.print("Inscrição bem sucedida no tópico: ");
    Serial.println(MQTT_TOPIC2);
  }
}

void reconnectWifi(){
  while (WiFi.status() != WL_CONNECTED)
  {
    WiFi.begin(net_ssid,net_password);
    delay(500);
    Serial.println(".");
  }
  Serial.println(" ");
  Serial.println("Conectado a: ");
  Serial.println(net_ssid);
}

void reconnectMQTT(){
  while (!MQTT.connected())
  {
    Serial.print("Tentando se conectar ao Broker MQTT ");
    Serial.println(MQTT_BROKER);

    if(MQTT.connect(MQTT_ID,MQTT_USERNAME,MQTT_PASSWORD))
    {
      Serial.println("Conectado com sucesso ao Broker MQTT");
      topicsSubscribe();
    }
    else
    {
      Serial.println("Falha ao conectar ao Broker");
      Serial.println("Nova tentativa em 2s");
      delay(2000);
    }
  }
}