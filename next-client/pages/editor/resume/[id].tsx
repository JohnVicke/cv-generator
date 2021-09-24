import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import ReactPDF, { PDFViewer } from '@react-pdf/renderer';

import styles from '../../../styles/Resume.module.scss';
import { getTemplate } from '../../../components/Resumes';
import { uploadResume } from '../../../api/api';
import { TemplateProps } from '../../../components/Resumes/types';

interface ResumeProps {}

const Resume: React.FC<ResumeProps> = ({}) => {
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const id = router.query;

  const ResumeDocument = getTemplate('default-template');

  const HARD_CODED_PROPS: TemplateProps = {
    headerInfo: {
      fullName: 'Viktor Malmedal',
      role: 'Full stack sänke',
      introduction: 'hihi hehe im a fucking noob',
      avatar: '/profile_pic.jpeg'
    },
    contact: {
      email: 'viktormalmedal@gmail.com',
      phoneNr: '070-368 18 55',
      location: 'Umeå, Sweden',
      website: 'viktormalmedal.com'
    },
    sections: [
      {
        title: 'Work Experience',
        column: 1,
        subSections: [
          {
            type: 'default',
            title: 'Summer internship',
            subTitle: 'Schibsted / Aftonbladet',
            from: new Date(2020, 6),
            to: new Date(2020, 9),
            description:
              'As a summer intern at Schibsted I worked as a full stack developer on Swedens biggest news paper, Aftonbladet.',
            tasksTitle: 'Achivements/Tasks',
            tasks: [
              'Created an internal tool (extension) for easier auto imports of packages in monorepos.',
              'Created an internal tool (extension) for easier auto imports of packages in monorepos.',
              'Created an internal tool (extension) for easier auto imports of packages in monorepos.'
            ]
          }
        ]
      },
      {
        title: 'Education',
        column: 1,
        subSections: []
      },
      {
        title: 'Kaok',
        column: 2,
        subSections: []
      }
    ]
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sendPdfToServer = async () => {
    const file = await ReactPDF.pdf(
      <ResumeDocument {...HARD_CODED_PROPS} />
    ).toBlob();
    const formData = new FormData();
    formData.append('resume', file);
    const res = await uploadResume(formData);
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.buttons}>
          <button onClick={sendPdfToServer}>send to server</button>
        </div>
      </div>
      <div className={styles.pdf}>
        {isClient && (
          <PDFViewer height="100%" width="100%">
            <ResumeDocument {...HARD_CODED_PROPS} />
          </PDFViewer>
        )}
      </div>
    </div>
  );
};

export default Resume;
