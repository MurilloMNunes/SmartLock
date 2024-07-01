import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';

interface ModalScreenProps {
    serialNumber : string;
    handleClose: () => void;
}

const ModalScreen: React.FC<ModalScreenProps> = ({serialNumber, handleClose})=> {

    const [name, setName] = useState('');
    const { isAuthenticated, userEmail, login, logout } = useAuth();
    const handleSave = async () => {
        try {
          const response = await axios.put(`http://143.107.182.42:6000/locks/${serialNumber}`, {
            nome: name,
            ownerEmail: userEmail
          });
          
          if (response.status === 200) {
            alert('Salvo com sucesso!');
            login(userEmail);
            handleClose();
          } else {
            alert('Falha ao salvar');
          }
        } catch (error) {
          console.error('Erro ao salvar a tranca:', error);
          alert('Erro ao salvar a tranca');
        }
      };
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
                <Text style={styles.text}>{serialNumber}</Text>
                <Text style={styles.text}>{userEmail}</Text>
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleClose}>
                    <Text style={styles.buttonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "rgba(24, 24, 24, 0.6)",
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content:{
        backgroundColor: 'white',
        width: "75%",
        padding: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
    },
    button: {
        backgroundColor: 'black',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        margin: 5,
        width: "75%"
      },
      buttonText: {
        color: '#fff',
        fontSize: 18,
      },
      input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
        width: "100%",
      }, 
      text: {
        height: 50,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
        textAlignVertical: 'center',
        fontSize: 16,
        backgroundColor: '#fff', // Cor de fundo para garantir consistência
      },
})

export default ModalScreen;