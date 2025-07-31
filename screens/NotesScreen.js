import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, FAB, Searchbar, Chip, Card, Title, Paragraph } from 'react-native-paper';
import { auth, database as db } from '../firebaseConfig';

export default function NotesScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    const uid = auth.currentUser.uid;
    return db
      .collection('users')
      .doc(uid)
      .collection('notes')
      .orderBy('createdAt', sortAsc ? 'asc' : 'desc')
      .onSnapshot((snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setNotes(docs);
        // build unique tags
        const allTags = [...new Set(docs.flatMap((n) => n.tags || []))];
        setTags(allTags);
      });
  }, [sortAsc]);

  const filtered = notes.filter((n) => {
    const matchSearch =
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchTag = selectedTag ? (n.tags || []).includes(selectedTag) : true;
    return matchSearch && matchTag;
  });

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search notes"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />
      <View style={styles.row}>
        <Button compact onPress={() => setSortAsc((s) => !s)}>
          Sort {sortAsc ? '↑' : '↓'}
        </Button>
        <Button compact onPress={() => auth.signOut()}>
          Logout
        </Button>
      </View>

      <View style={styles.chips}>
        {tags.map((t) => (
          <Chip
            key={t}
            selected={t === selectedTag}
            onPress={() => setSelectedTag(t === selectedTag ? null : t)}>
            {t}
          </Chip>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            style={styles.card}
            onPress={() => navigation.navigate('ViewNote', { noteId: item.id })}>
            <Card.Content>
              <Title>{item.title}</Title>
              <Paragraph numberOfLines={2}>{item.content}</Paragraph>
            </Card.Content>
          </Card>
        )}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('EditNote', { note: null })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8 },
  search: { marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  card: { marginBottom: 6 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
});