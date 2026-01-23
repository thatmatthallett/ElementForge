import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './ef-badge.ts';
import '../ef-icon/ef-icon.ts';
import { iconNames } from '../../assets/icons/icon-types';
import { colorValues } from '../../tokens/colorSet';

const meta: Meta = {
  title: 'Components/ef-badge',
  component: 'ef-badge',

  args: {
    color: 'primary',
    icon: null,    
    size: 'md',
    shape: 'rounded',
    variant: 'solid',
    text: 'Badge',
  },

  argTypes: {
    text: { control: 'text' },

    color: {
      control: 'select',
      options: colorValues,
    },

    icon: {
      control: 'select',
      options: iconNames,
    },


    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'xxl'],
    },

    shape: {
      control: 'select',
      options: ['square', 'rounded', 'pill'],
    },
    

    variant: {
      control: 'select',
      options: ['solid', 'subtle', 'outline'],
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <ef-badge
      color=${args.color}
      icon=${args.icon}
      size=${args.size}
      shape=${args.shape}
      variant=${args.variant}
    >
      ${args.text}
    </ef-badge>
  `,
};