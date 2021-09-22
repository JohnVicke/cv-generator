import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { suppressReactRendererConsoleError } from '../../utils/suppressReactRendererConsoleError';

const pdfStyles = StyleSheet.create({
  page: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    backgroundColor: '#2D3748',
    width: '100%',
    minHeight: '122px',
    display: 'flex',
    flexDirection: 'column',
    padding: 20
  },
  contact: {
    backgroundColor: '#1A202C',
    height: 20,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    color: '#fff',
    paddingTop: 4,
    paddingBottom: 4,
    fontSize: 10
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
  },
  row: {
    marginTop: 20,
    display: 'flex'
  },

  column: {
    flex: '50%'
  },
  expSection: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  expSectionTitle: {
    color: '#F56565',
    fontWeight: 'bold',
    fontSize: 18,
    borderBottom: '2px solid #F56565',
    paddingBottom: 2
  },
  generalSection: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  generalSectionTitle: {
    color: '#F56565',
    fontWeight: 'bold',
    fontSize: 18
  },
  columnContent: {
    display: 'flex',
    flexDirection: 'column'
  }
});

interface ResumeProps {}

suppressReactRendererConsoleError();

export const ResumeDocument: React.FC<ResumeProps> = ({}) => {
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.fullName}>Viktor Malmedal</Text>
          <Text style={pdfStyles.role}>Software Engineer</Text>
          <Text style={pdfStyles.introduction}>
            Hard-working and enthusiastic engineering student interested in IT
            and everything in its orbit.
          </Text>
        </View>

        <View style={pdfStyles.contact}>
          <Text>viktormalmedal@gmail.com</Text>
          <Text>070-3681855</Text>
          <Text>Umeå, Sverige</Text>
          <Text>www.viktormalmedal.com</Text>
        </View>

        <View style={pdfStyles.row}>
          <View style={pdfStyles.column}>
            <View style={pdfStyles.columnContent}>
              <View style={pdfStyles.expSection}>
                <Text style={pdfStyles.expSectionTitle}>
                  From react hehihihiih
                </Text>
              </View>

              <View style={pdfStyles.expSection}>
                <Text style={pdfStyles.expSectionTitle}>hiihhiih</Text>
              </View>
            </View>
          </View>
          <View style={pdfStyles.column}>
            <View style={pdfStyles.columnContent}>
              <View style={pdfStyles.generalSection}>
                <Text style={pdfStyles.generalSectionTitle}>
                  From react hehihihiih
                </Text>
              </View>

              <View style={pdfStyles.generalSection}>
                <Text style={pdfStyles.generalSectionTitle}>Hello world</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
