import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, TextInput, Chip } from 'react-native-paper';
import { auth, database as db } from '../firebaseConfig';

export default function EditNoteScreen({ navigation, route }) {
  const { note } = route.params || {};
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState(note?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const insets = useSafeAreaInsets();

  const uid = auth.currentUser.uid;

  const save = () => {
    const data = { title, content, tags, createdAt: note?.createdAt || new Date() };
    const ref = db.collection('users').doc(uid).collection('notes');
    if (note) ref.doc(note.id).update(data);
    else ref.add(data);
    navigation.goBack();
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 8 }]}
    >
      <TextInput label="Title" value={title} onChangeText={setTitle} />
      <TextInput
        label="Content"
        value={content}
        onChangeText={setContent}
        multiline
        style={styles.content}
      />

      <View style={styles.chips}>
        {tags.map((t) => (
          <Chip key={t} onClose={() => setTags(tags.filter((x) => x !== t))}>
            {t}
          </Chip>
        ))}
      </View>

      <View style={styles.row}>
        <TextInput
          label="New tag"
          value={tagInput}
          onChangeText={setTagInput}
          onSubmitEditing={addTag}
          style={styles.tagInput}
        />
        <Button onPress={addTag}>Add</Button>
      </View>

      <Button mode="contained" onPress={save} style={styles.btn}>
        Save
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 24 },
  content: { minHeight: 120, marginVertical: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  tagInput: { flex: 1, marginRight: 8 },
  btn: { marginVertical: 8 },
});