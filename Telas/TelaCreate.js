import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, setDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';

export default function TelaCreate() {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');

  const create = async () => {
    try {
      const usuariosRef = collection(db, 'Usuários');
      const snapshot = await getDocs(usuariosRef);

      
      const novoID = (snapshot.size + 1).toString().padStart(3, '0');

      await setDoc(doc(db, 'Usuários', novoID), {
        nome: nome,
        idade: idade
        
      });

      alert(`Usuário ${novoID} criado com sucesso!`);
      setNome('');
      setIdade('');
    } catch (error) {
      alert('Erro ao criar usuário: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome da Coleção:</Text>
      <TextInput
        style={[styles.input, { backgroundColor: '#eee' }]}
        value="Usuários"
        editable={false}
      />

      <Text style={styles.label}>Nome do Usuário:</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome"
      />

      <Text style={styles.label}>Idade:</Text>
      <TextInput
        style={styles.input}
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
        placeholder="Digite a idade"
      />

      <TouchableOpacity style={styles.button} onPress={create}>
        <Text style={styles.buttonText}>SALVAR DADOS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 15
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 5
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    marginTop: 30,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
