import React, { useEffect, useState } from 'react';
import { createRepo, getRepository } from '../../api/api';
import { useGitHubContext } from '../../context/github';

interface UpdatePageProps {}

const UpdatePage: React.FC<UpdatePageProps> = ({}) => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [loading, setLoading] = useState(true);
  const [repoExists, setRepoExists] = useState(false);
  const { uploadPdfToServer } = useGitHubContext();

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target.files && event.target.files[0])
      setSelectedFile(event.target.files[0]);
  };

  const onUploadPdf = async () => {
    if (!selectedFile) return;
    uploadPdfToServer(selectedFile);
  };

  const onCreateRepo = async () => {
    const { data } = await createRepo();
  };

  useEffect(() => {
    (async () => {
      const { data } = await getRepository();
      if (data.repoExists) {
        setRepoExists(true);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {!repoExists ? (
        <button onClick={onCreateRepo}>Generate repository</button>
      ) : (
        <>
          <input
            type="file"
            name="file"
            onChange={onInputChange}
            accept="application/pdf"
          />
          <button onClick={onUploadPdf}>Upload pdf to server</button>
        </>
      )}
    </div>
  );
};

export default UpdatePage;
