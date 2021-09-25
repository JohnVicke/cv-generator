import { ResumeSectionProps } from './types';

export const getTwoColumnLayout = (sections: ResumeSectionProps[] = []) => {
  const column1 = sections?.filter((section) => section.column === 1);
  const column2 = sections?.filter((section) => section.column === 2);
  return { column1, column2 };
};
