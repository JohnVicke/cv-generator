import React, { useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import ReactPDF from '@react-pdf/renderer';

import styles from '../../../styles/Resume.module.scss';
import { ResumeDocument } from '../../../components/Resume';
import { uploadResume } from '../../../api/api';

interface ResumeProps {}

const Resume: React.FC<ResumeProps> = ({}) => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const router = useRouter();
  const id = router.query;

  const sendPdfToServer = async () => {
    const file = await ReactPDF.pdf(<ResumeDocument />).toBlob();
    const formData = new FormData();
    formData.append('resume', file);
    const res = await uploadResume(formData);
    console.log(res);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target.files && event.target.files[0])
      setSelectedFile(event.target.files[0]);
  };

  const uploadPdfToServer = async () => {
    if (!selectedFile) {
      return;
    }
    const blob = new Blob([selectedFile], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('resume', blob);
    const res = await uploadResume(formData);
    console.log(res);
  };

  return (
    <div className={styles.root}>
      <div className={styles.buttons}>
        <button onClick={sendPdfToServer}>send to server</button>
        <input
          type="file"
          name="file"
          onChange={onInputChange}
          accept="application/pdf"
        />
        <button onClick={uploadPdfToServer}>Upload pdf to server</button>
      </div>
      {/* <ResumeDocument /> */}
    </div>
  );
};

export default Resume;
