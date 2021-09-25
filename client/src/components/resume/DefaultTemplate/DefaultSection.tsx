import React from 'react';
import { StyleSheet, View, Text } from '@react-pdf/renderer';
import { ResumeSectionProps } from '../types';
import { DefaultSubSection } from './DefaultSubSection';

const styles = StyleSheet.create({
  section: {
    margin: 10,
    padding: 10
  },
  sectionTitle: {
    color: '#F56565',
    fontWeight: 'bold',
    fontSize: 18
  }
});

const subSectionTypes = [{ name: 'default', component: DefaultSubSection }];

const getSubSectionType = (name: string) =>
  subSectionTypes!.find((subSection) => subSection.name === name)!.component;

export const DefaultSection: React.FC<ResumeSectionProps> = (props) => {
  const { title, subSections } = props;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subSections.map((subSection, i) => {
        const SubSection = getSubSectionType(subSection.type);
        return (
          <SubSection {...subSection} key={`key-${i}-${subSection.type}`} />
        );
      })}
    </View>
  );
};
