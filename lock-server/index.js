// Importa e declara o objeto do express
const express = require('express');
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');
const mqtt = require('mqtt');

// Arquivos das Rotas
const userRoutes = require('./routes/userRoutes');
const trancaRoutes = require('./routes/locksRoutes'); 
const Tranca = require('./models/Tranca'); // Adicione esta linha para importar o modelo Tranca

// Porta de operação 
const PORT = process.env.PORT;

//Passwords 
const passwd = process.env.password;
const mqttUser = process.env.mqttUser;
const mqttPasswd = process.env.mqttPasswd;

app.use(express.json()); // Para analisar o corpo da requisição como JSON
app.use(express.urlencoded({ extended: true })); // Para dados 

// Conectar ao MongoDB
mongoose.connect(`mongodb+srv://${process.env.user}:${passwd}@lockdb.0w8uz0g.mongodb.net/?retryWrites=true&w=majority&appName=lockdb`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Conectado ao MongoDB')).catch(err => console.error('Erro ao conectar ao MongoDB', err));

//Configuração das rotas
app.use('/users', userRoutes);
app.use('/locks', trancaRoutes); // Adicione esta linha

// Configurações do broker MQTT
const mqttBrokerUrl = 'mqtt://igbt.eesc.usp.br:1883'; // Substitua pelo URL do seu broker
const mqttClient = mqtt.connect(mqttBrokerUrl, {
    username: mqttUser, // Substitua pelo nome de usuário
    password: mqttPasswd // Substitua pela senha
});

// Evento quando o cliente MQTT se conecta
mqttClient.on('connect', () => {
    console.log('Conectado ao broker MQTT');
    // Inscreva-se em um tópico (opcional)
    mqttClient.subscribe('/smartlock/sensor_porta');
    mqttClient.subscribe('/smartlock/desbloqueio_porta');

    mqttClient.on('message', async (topic, message) => {
        console.log(`Mensagem recebida no tópico ${topic}: ${message.toString()}`);
        
        if (topic === '/smartlock/sensor_porta') {
            const serial_num = message.toString();

            try {
                const tranca = await Tranca.findOne({ serial_num });
                const newIsDoorOpen = !tranca.isDoorOpen;
                const update = { isDoorOpen: newIsDoorOpen };
                
                const lock = await Tranca.findOneAndUpdate({ serial_num }, update, { new: true });
                if (lock) {
                    console.log(`Tranca ${serial_num} atualizada para isdooropen: ${update.isDoorOpen}`);
                } else {
                    console.error(`Tranca com serial_num ${serial_num} não encontrada`);
                }
            } catch (error) {
                console.error('Erro ao processar mensagem do sensor:', error);
            }
        }
    });

    app.post('/publicar', (req, res) => {
        const { mac_address } = req.body;
        mqttClient.publish('/smartlock/desbloqueio_porta', mac_address);
        res.send('Mensagem publicada no tópico.');
    });
});


app.get("/",function(req,res) {
    res.send("Olá funcionando!");
})
// Inicia o servidor
app.listen(PORT || 6000, () => {

    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    // Obtendo o endereço IP da interface de rede
    let ipAddress = 'localhost';
    for (let interfaceName in networkInterfaces) {
        for (let i = 0; i < networkInterfaces[interfaceName].length; i++) {
        const iface = networkInterfaces[interfaceName][i];
        if (iface.family === 'IPv4' && !iface.internal) {
            ipAddress = iface.address;
        }
        }
    }
  
  console.log(`Server is running on http://${ipAddress}:${PORT}`);
});
