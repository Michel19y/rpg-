import React, { useState } from 'react';
import { Button, Text, TextInput, View, StyleSheet, Alert } from 'react-native';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../Firebase'; // Certifique-se de que seu arquivo Firebase está exportando 'db'

export default function TelaDelete() {
  const [id, setId] = useState('');

  const remove = async () => {
    if (!id) {
      Alert.alert('Erro', 'Informe o ID');
      return;
    }

    try {
      await deleteDoc(doc(db, 'Usuários', id));
      setId('');
      Alert.alert('Sucesso', 'Documento excluído com sucesso!');
    } catch (error) {
      Alert.alert('Erro', `Erro ao excluir: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome da Coleção:</Text>
      <TextInput
        value="Usuários"
        editable={false}
        style={[styles.input, { backgroundColor: '#eee' }]}
      />

      <Text style={styles.label}>Id:</Text>
      <TextInput
        placeholder="001"
        value={id}
        onChangeText={setId}
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <Button title="EXCLUIR DOCUMENTO" onPress={remove} color="#007bff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
});
