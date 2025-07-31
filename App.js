import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import firebase from 'firebase';

import { auth } from './firebaseConfig';
import AuthScreen from './screens/AuthScreen';
import NotesScreen from './screens/NotesScreen';
import EditNoteScreen from './screens/EditNoteScreen';
import ViewNoteScreen from './screens/ViewNoteScreen';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);
    return unsub;
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {user ? (
            <>
              <Stack.Screen name="Notes" component={NotesScreen} />
              <Stack.Screen name="EditNote" component={EditNoteScreen} />
              <Stack.Screen name="ViewNote" component={ViewNoteScreen} />
            </>
          ) : (
            <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}