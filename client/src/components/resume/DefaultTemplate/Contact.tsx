import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { ResumeContactProps } from '../types';

const styles = StyleSheet.create({
  contact: {
    backgroundColor: '#1A202C',
    height: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    color: '#fff',
    paddingTop: 4,
    paddingBottom: 4,
    fontSize: 10
  }
});

export const Contact: React.FC<ResumeContactProps> = ({
  email,
  location,
  phoneNr,
  website
}: ResumeContactProps) => {
  return (
    <View style={styles.contact}>
      <Text>{email}</Text>
      <Text>{phoneNr}</Text>
      <Text>{location}</Text>
      <Text>{website}</Text>
    </View>
  );
};
