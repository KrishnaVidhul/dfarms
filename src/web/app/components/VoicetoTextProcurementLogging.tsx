jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { useTheme } from '@shopify/react-native-paper';
import { Mic2 } from 'lucide-react-native';

const VoiceToTextProcurement = () => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const theme = useTheme();

  const startRecording = async () => {
    try {
      // Placeholder for actual recording logic
      Alert.alert('Start Recording', 'Voice-to-Text Procurement is starting...');
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      // Placeholder for actual recording logic
      Alert.alert('Stop Recording', 'Voice-to-Text Procurement has stopped.');
      setIsRecording(false);
      // Placeholder for converting voice to text and updating state
      setText('Converted Text Here');
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={isRecording ? stopRecording : startRecording} style={styles.recordButton}>
        {isRecording ? <Text style={styles.recordButtonText}>Stop Recording</Text> : <Mic2 size="48" color={theme.colors.primary} />}
      </TouchableOpacity>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Converted Text"
        placeholderTextColor={theme.colors.text}
        multiline
        style={[styles.textInput, { borderColor: theme.colors.border }]}
        editable={!isRecording}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#12161c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    backgroundColor: '#4e555a',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  recordButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: '#25282e',
    borderRadius: 8,
    padding: 12,
    height: 100,
    width: '100%',
    color: '#ffffff',
    fontSize: 16,
  },
});

export default VoiceToTextProcurement;
