import React, { useState } from 'react';
import { SafeAreaView, TextInput, View, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import ModalScreen  from '../components/modal/modal_add';

const AddLockScreen: React.FC = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const [password, setPassword] = useState('');
  const { isAuthenticated, userEmail, login, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const handleAddLock = async () => {
    try {
      // Fazer a requisição para buscar o serial_num
      const response = await axios.get(`http://143.107.182.42:6000/locks/search/serial_num/${serialNumber}`);
      const lock = response.data;

      // Verificar se o serial_num existe
      if (lock && lock.length > 0) {
        // Comparar a senha fornecida com a senha cadastrada
        if (lock[0].password === password) {
          // Se a verificação for bem-sucedida, abrir o modal
          setModalVisible(true);
        } else {
          alert('Senha incorreta');
        }
      } else {
        alert('Número de série não encontrado');
      }
    } catch (error) {
      console.error('Erro ao adicionar a tranca:', error);
      alert('Erro ao adicionar a tranca');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Add Lock</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={28} color="black" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Lock's Serial Number"
        value={serialNumber}
        onChangeText={setSerialNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Lock's Exclusive Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleAddLock}>
        <Text style={styles.buttonText}>Add Lock</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <ModalScreen serialNumber={serialNumber} handleClose={() => setModalVisible(false)}/>
      </Modal>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
  },
  button: {
    height: 50,
    backgroundColor: 'black',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: '10%',
    paddingBottom: '10%',
    flex: 1,
  },
  signOutButton: {
    padding: 10,
  },
});

export default AddLockScreen;
