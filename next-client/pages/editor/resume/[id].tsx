import React from 'react';
import { useRouter } from 'next/dist/client/router';
import ReactPDF from '@react-pdf/renderer';

import styles from '../../../styles/Resume.module.scss';
import { ResumeDocument } from '../../../components/Resume';
import { uploadResume } from '../../../api/api';

interface ResumeProps {}

const Resume: React.FC<ResumeProps> = ({}) => {
  /**
   * fetch saved resume here
   */
  const router = useRouter();
  const id = router.query;

  const sendPdfToServer = async () => {
    const file = await ReactPDF.pdf(<ResumeDocument />).toBlob();
    const formData = new FormData();
    formData.append('resume', file);
    const res = await uploadResume(formData);
    console.log(res);
  };

  return (
    <div className={styles.root}>
      <button onClick={sendPdfToServer}>send to server</button>
      <ResumeDocument />
    </div>
  );
};

export default Resume;
