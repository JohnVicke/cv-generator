import React from 'react';
import { Document, Page, StyleSheet, View } from '@react-pdf/renderer';
import { Contact } from './Contact';
import { DefaultSection } from './DefaultSection';
import { TemplateProps } from '../types';
import { Header } from './Header';
import { getTwoColumnLayout } from '../utils';

const styles = StyleSheet.create({
  page: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    flexDirection: 'row'
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: '100%',
    flex: 1
  }
});

const DefaultTemplate: React.FC<TemplateProps> = (props) => {
  const { headerInfo, contact, sections } = props;
  const { column1, column2 } = getTwoColumnLayout(sections);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Header {...headerInfo} />
        <Contact {...contact} />
        <View style={styles.row}>
          <View style={styles.column}>
            {column1?.map((section, i) => (
              <DefaultSection {...section} key={`key-${i}-${section.title}`} />
            ))}
          </View>
          <View style={styles.column}>
            {column2?.map((section, i) => (
              <DefaultSection {...section} key={`key-${i}-${section.title}`} />
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default DefaultTemplate;
