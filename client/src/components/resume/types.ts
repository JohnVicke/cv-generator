type SubSectionTypes = 'default';

export type ResumeHeaderProps = {
  fullName: string;
  role: string;
  introduction?: string;
  avatar?: string;
};

export type ResumeContactProps = {
  email?: string;
  phoneNr?: string;
  location?: string;
  website?: string;
};

export type DefaultSubSectionProps = {
  title: string;
  subTitle: string;
  from?: Date;
  to?: Date | string;
  description?: string;
  type: SubSectionTypes;
  tasksTitle: string;
  tasks?: string[];
};

export type SpecialSectionProps = {
  specialItems?: [];
};

export type DefaultSectionProps = {
  subSections: DefaultSubSectionProps[] & SpecialSectionProps[];
};

export type ResumeSectionProps = DefaultSectionProps &
  SpecialSectionProps & {
    title: string;
    column?: 1 | 2;
  };

export type TemplateProps = {
  headerInfo: ResumeHeaderProps;
  contact: ResumeContactProps;
  sections?: ResumeSectionProps[];
  extra?: ResumeSectionProps[];
};
