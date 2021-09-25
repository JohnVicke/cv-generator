import React from 'react';
import { StyleSheet, View, Text, Circle, Svg } from '@react-pdf/renderer';
import { DefaultSubSectionProps } from '../types';

const styles = StyleSheet.create({
  title: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14
  },
  subTitle: {
    color: '#000',
    fontSize: 14
  },
  date: {
    fontSize: 10,
    color: '#F56565',
    fontStyle: 'italic'
  },
  description: {
    fontSize: 10,
    color: '#494949'
  },
  task: {
    marginBottom: 2,
    fontSize: 10,
    display: 'flex',
    flexDirection: 'row'
  },
  circle: {
    marginLeft: 5,
    marginRight: 5
  }
});

const getDateString = (date?: Date) => {
  if (date) return `${date.getMonth()}/${date.getFullYear()}`;
};

const getFullDateString = (from?: Date, to?: Date | string) => {
  if (!from) return;
  return `${getDateString(from)}${
    to ? ` - ${typeof to === 'string' ? to : getDateString(to)}` : undefined
  }`;
};

export const DefaultSubSection: React.FC<DefaultSubSectionProps> = (props) => {
  const { title, subTitle, from, to, description, tasks, tasksTitle } = props;

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subTitle}>{subTitle}</Text>
      <Text style={styles.date}>{getFullDateString(from, to)}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.date}>{tasksTitle}</Text>
      <View>
        {tasks?.map((task, i) => (
          <View style={styles.task} key={`task-${i}`}>
            <Svg height={10} width={6} style={styles.circle}>
              <Circle cx={2.5} cy={6} r={2.5} fill="#F56565" />
            </Svg>
            <Text style={styles.task}>{task}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
