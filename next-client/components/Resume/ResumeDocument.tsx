import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { suppressReactRendererConsoleError } from '../../utils/suppressReactRendererConsoleError';

const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

interface ResumeProps {}

suppressReactRendererConsoleError();

export const ResumeDocument: React.FC<ResumeProps> = ({}) => {
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.section}>
          <Text>From react hehihihiih </Text>
        </View>
        <View style={pdfStyles.section}>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );
};
