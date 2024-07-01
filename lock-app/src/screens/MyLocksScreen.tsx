import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, Text, TouchableOpacity, View, StyleSheet, Modal } from 'react-native';
import { TabBarIcon } from '@/src/components/navigation/TabBarIcon';
import ModalScreen  from '../components/modal/modal_mylock'
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

// Definindo a interface para o objeto Lock
interface Lock {
  nome: string;
  ownerEmail: string;
  isOpen: boolean;
  isDoorOpen: boolean;
  serial_num: string;
  password: string;
}

// Definindo a interface para as propriedades de LockItem
interface LockItemProps {
  name: string;
  lock: boolean;
  door: boolean;
  onLockToggle: () => void;
}

// Componente LockItem com tipagem explícita
const LockItem: React.FC<LockItemProps> =({ name, lock, door, onLockToggle }) => (
  <TouchableOpacity onPress={onLockToggle}>
    <View style={styles.item}>
      <Text style={styles.title}>{name}</Text>
      <TabBarIcon name={lock ? 'lock' : 'lock-open'} color={'black'} /> 
      <TabBarIcon name={door ? 'door-closed' : 'door-open'} color={'black'} />
    </View>
  </TouchableOpacity>
  
);

// Componente principal HomeScreen
const MyLocksScreen: React.FC = () => {
  const [locks, setLocks] = useState<Lock[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [serialNumber, setSerialNumber] = useState('');
  const [isLockOpen, setIsLockOpen] = useState(false);
  const [name, setName] = useState('');
  const { isAuthenticated, userEmail, login, logout } = useAuth();
  const fetchLocks = async () => {
      try {
        //RECEBER E-MAIL DO LOGIN DO USUÁRIO
        //console.log(userEmail)
        const encodedEmail = encodeURIComponent(userEmail);
        const response = await axios.get(`http://143.107.182.42:6000/locks/search/email/${encodedEmail}`) // Substitua pela URL do seu servidor
        //const response = await axios.get('http://10.0.2.2:3000/locks/search/email/vinicius.st@usp.br')
        
        setLocks(response.data.map((item:Lock) => ({
          nome: item.nome,
          ownerEmail: item.ownerEmail,
          isOpen: item.isOpen,
          isDoorOpen: item.isDoorOpen,
          serial_num: item.serial_num,
          password: item.password
        })));
        //FALTA FAZER DESERIALIZAÇÃO
        //setLocks(response.data);
        //=============

      } catch (error) {
        console.error('Error fetching locks:', error);
      }
  };

  useEffect(() => {
    fetchLocks();
  }, [userEmail]);

  const handleLockToggle = (serial_num: string, is_lock_open: boolean, nome: string) => {
    setSerialNumber(serial_num);
    setIsLockOpen(is_lock_open);
    setName(nome);
    setModalVisible(true);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.signOutButton} onPress={fetchLocks}>
          <FontAwesome name="refresh" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>My Locks</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={28} color="black" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={locks}
        renderItem={({ item }) => (
          <LockItem
            name={item.nome}
            lock={item.isOpen}
            door={item.isDoorOpen}
            onLockToggle={() => handleLockToggle(item.serial_num, item.isOpen, item.nome)}
          />
        )}
        keyExtractor={item => item.serial_num}
      />
      

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <ModalScreen serialNumber={serialNumber} isOpen={isLockOpen} name={name} handleClose={() => setModalVisible(false)}/>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:"10%",
  },
  button: {
    flex: 1,
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    paddingLeft: 10,
    justifyContent: 'flex-start',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
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
    flex: 1,
  },
  signOutButton: {
    padding: 10,
  },
});

export default MyLocksScreen;