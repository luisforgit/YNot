import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Chip, Text, Button, Snackbar } from 'react-native-paper';
import { database, auth } from '../firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ViewNoteScreen({ navigation, route }) {
  const { noteId } = route.params;

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState('');

  const insets = useSafeAreaInsets();

  /* Listener em tempo-real */
  useEffect(() => {
    const unsub = database
      .collection('users')
      .doc(auth.currentUser.uid)
      .collection('notes')
      .doc(noteId)
      .onSnapshot(
        (doc) => {
          setLoading(false);
          if (doc.exists) {
            setNote({ id: doc.id, ...doc.data() });
          } else {
            setNote(null);
          }
        },
        (err) => {
          setLoading(false);
          setSnack('Erro ao carregar nota');
        }
      );
    return unsub;
  }, [noteId]);

  /* Apagar com confirmação */
  const handleDelete = () => {
    Alert.alert(
      'Apagar Nota',
      'Tem certeza que deseja apagar esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await database
                .collection('users')
                .doc(auth.currentUser.uid)
                .collection('notes')
                .doc(noteId)
                .delete();
              navigation.goBack();
            } catch (e) {
              setSnack('Erro ao apagar');
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('EditNote', { note });
  };

  /* Estados de loading / not-found */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!note) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Nota não encontrada</Text>
        <Button onPress={() => navigation.goBack()}>Voltar</Button>
      </View>
    );
  }

  /* Render */
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{note.title}</Text>

        <Text style={styles.content}>{note.content}</Text>

        {note.tags?.length > 0 && (
          <View style={styles.tagRow}>
            {note.tags.map((t) => (
              <Chip key={t} style={styles.tag}>
                {t}
              </Chip>
            ))}
          </View>
        )}

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Icon name="calendar-plus" size={16} color="#666" />
            <Text style={styles.metaText}>
              Criada:{' '}
              {note.createdAt?.toDate
                ? note.createdAt.toDate().toLocaleString()
                : note.createdAt || '—'}
            </Text>
          </View>

          {note.updatedAt && (
            <View style={styles.metaItem}>
              <Icon name="calendar-edit" size={16} color="#666" />
              <Text style={styles.metaText}>
                Editada:{' '}
                {note.updatedAt.toDate
                  ? note.updatedAt.toDate().toLocaleString()
                  : note.updatedAt}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.actions, { paddingBottom: insets.bottom }]}>
        <Button
          mode="contained"
          icon="pencil"
          style={styles.btn}
          onPress={handleEdit}
          loading={loading}
          disabled={loading}
        >
          Editar
        </Button>

        <Button
          mode="outlined"
          icon="delete"
          style={styles.btn}
          onPress={handleDelete}
          disabled={loading}
        >
          Apagar
        </Button>
      </View>

      <Snackbar
        visible={!!snack}
        onDismiss={() => setSnack('')}
        duration={3000}
      >
        {snack}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 24, paddingBottom: 100 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  content: { fontSize: 16, lineHeight: 24, marginBottom: 16 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  tag: { marginRight: 6, marginBottom: 6, backgroundColor: '#e0e0e0' },
  meta: { marginTop: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  metaText: { marginLeft: 6, fontSize: 14, color: '#666' },
  actions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  btn: { flex: 1, marginHorizontal: 4 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#666', marginBottom: 16 },
});