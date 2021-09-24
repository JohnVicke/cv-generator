import { DefaultTemplate } from './DefaultTemplate/index';
import { TemplateProps } from './types';

type TemplateMap = {
  name: string;
  component: React.FC<TemplateProps>;
};

const templates: TemplateMap[] = [
  { name: 'default-template', component: DefaultTemplate }
];

// TODO: Implement error boundaries
export const getTemplate = (name: string) => {
  return templates!.find((template: TemplateMap) => template.name === name)!
    .component;
};
