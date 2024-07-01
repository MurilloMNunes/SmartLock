import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react';
import { TabBarIcon } from '@/src/components/navigation/TabBarIcon';
import axios from 'axios';

interface ModalScreenProps {
    serialNumber : string;
    isOpen : boolean;
    name: string;
    handleClose: () => void;
}

const ModalScreen: React.FC<ModalScreenProps> = ({serialNumber, isOpen, name, handleClose})=> {
    const [isEnabled, setIsEnabled] = useState(isOpen);
    const toggleSwitch = async () => {
        const newIsEnabled = !isEnabled;
        setIsEnabled(newIsEnabled);
      
        try {
          const response1 = await axios.post(`http://143.107.182.42:6000/publicar`, {
            mac_address: serialNumber
          });
          console.log('Publicar response:', response1.data);
      
          const response2 = await axios.put(`http://143.107.182.42:6000/locks/${serialNumber}`, {
            isDoorOpen: isEnabled
          });
          console.log('Locks update response:', response2.data);
        } catch (error) {
          console.error('Error:', error);
          alert('Falha ao alterar');
        }
      };
      
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.text}>{name}</Text>
                <Text style={styles.text}>{serialNumber}</Text>
                <TabBarIcon name={isEnabled ? 'lock' : 'lock-open'} color={'black'} size={50}/> 
                <View style={styles.space}></View>
                <Switch
                    trackColor={{false: 'gray', true: 'black'}}
                    thumbColor={isEnabled ? 'gray' : 'black'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                    style={styles.switch}
                />
                <View style={styles.space}></View>
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
        width: "75%",
      },
      buttonText: {
        color: '#fff',
        fontSize: 18,
      },
      switch:{
        transform: [{scale: 1.5}],
      },
      text: {
        paddingBottom: 20,
        fontSize: 24,
      },
      space: {
        padding: 10,
      }
})

export default ModalScreen;