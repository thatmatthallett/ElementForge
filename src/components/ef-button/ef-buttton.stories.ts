import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../index.ts';
import { iconNames } from '../../assets/icons/icon-types';
import { colorValues, shapeValues } from '../../tokens/';

const meta: Meta = {
  title: 'Components/ef-button',
  component: 'ef-button',

  args: {
    color: 'primary',
    disabled: false,
    icon: null,
    iconPosition: 'start', 
    loader: false,
    loading: false,
    loadingIcon: 'loader-2',
    size: 'md',
    shape: 'rounded',
    type: 'button',
    toggle: false,
    toggled: false,
    toggleIcon: null,
    variant: 'solid',
    text: 'Button',
  },

  argTypes: {
    text: { control: 'text' },

    color: {
      control: 'select',
      options: colorValues,
    },
    disabled: {
      control: 'boolean',
    },
    icon: {
      control: 'select',
      options: iconNames,
    },
    iconPosition: {
      control: 'select',
      options: ['start', 'end'],
    }, 
    loader: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    loadingIcon: {
      control: 'select',
      options: iconNames,
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'xxl'],
    },
    shape: {
      control: 'select',
      options: shapeValues,
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
    },
    toggle: {
      control: 'boolean',
    },
    toggled: {
      control: 'boolean',
    },
    toggleIcon: {
      control: 'select',
      options: iconNames,
    },
    variant: {
      control: 'select',
      options: ['solid', 'ghost', 'link', 'outline', 'soft'],
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <ef-button>
      ${args.text}
    </ef-button>
  `,
};