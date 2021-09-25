import React from 'react';
import { ResumeHeaderProps } from '../types';
import { Image, View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2D3748',
    width: '100%',
    minHeight: '122px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20
  },
  headerInfo: {
    width: '70%',
    display: 'flex',
    flexDirection: 'column'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: '50%'
  },
  fullName: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold'
  },
  role: {
    fontSize: 12,
    color: '#F56565',
    fontWeight: 'medium'
  },
  introduction: {
    fontSize: 10,
    color: '#fff'
  }
});

export const Header: React.FC<ResumeHeaderProps> = (props) => {
  const { fullName, role, avatar, introduction } = props;
  return (
    <View style={styles.header}>
      <View style={styles.headerInfo}>
        <Text style={styles.fullName}>{fullName}</Text>
        <Text style={styles.role}>{role}</Text>
        <Text style={styles.introduction}>{introduction}</Text>
      </View>
      <Image style={styles.avatar} src={avatar} />
    </View>
  );
};
