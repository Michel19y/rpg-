import { useState } from 'react';
import { Button, Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase'; // ajuste o caminho se estiver diferente

export default function TelaUpdate() {
  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');

  const update = async () => {
    try {
      const documentRef = doc(db, 'Usuários', id);

      await updateDoc(documentRef, {
        nome: nome,
        idade: idade
      });

      setId('');
      setNome('');
      setIdade('');
      alert('Dados atualizados com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar: ' + error.message);
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

      <Text style={styles.label}>Id:</Text>
      <TextInput
        style={styles.input}
        value={id}
        onChangeText={setId}
        placeholder="Digite o ID do usuário"
      />

      <Text style={styles.label}>Novo Nome:</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o novo nome"
      />

      <Text style={styles.label}>Nova Idade:</Text>
      <TextInput
        style={styles.input}
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
        placeholder="Digite a nova idade"
      />

      <TouchableOpacity style={styles.button} onPress={update}>
        <Text style={styles.buttonText}>ATUALIZAR DADOS</Text>
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
