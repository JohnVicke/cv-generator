import { CV_GENERATOR_BASE_HTML } from './constants';

export type GetIndexParams = {
  owner: string;
  name: string;
};

export const getIndexHtml = (params?: GetIndexParams) => {
  const { name, owner } = params!;
  const title = `${name}'s resume`;
  const iFrame = `https://docs.google.com/gview?url=https://github.com/${owner}/resume2/raw/main/resume.pdf&embedded=true`;
  return CV_GENERATOR_BASE_HTML.replace(
    '<!-- iframe placeholder -->',
    iFrame
  ).replace('<!-- title placeholder -->', title);
};

export const getResume = () => {
  return 'hello world';
};

export const getReadme = () => {
  return `# GitHub page hosting my resume

    Last updated at ${new Date().getDate()}


    Generated by http://localhost:8080
  `;
};
