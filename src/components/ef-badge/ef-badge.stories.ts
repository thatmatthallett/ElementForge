import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './ef-badge.js';

const meta: Meta = {
  title: 'Components/ef-badge',
  component: 'ef-badge',

  args: {
    text: 'Badge',
    variant: 'primary',
    size: 'md',
    shape: 'rounded',
    uppercase: false,
  },

  argTypes: {
    text: { control: 'text' },

    variant: {
      control: 'select',
      options: ['primary', 'neutral', 'info', 'success', 'warning', 'danger'],
    },

    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'xxl'],
    },

    shape: {
      control: 'select',
      options: ['square', 'rounded', 'pill'],
    },

    uppercase: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <ef-badge
      variant=${args.variant}
      size=${args.size}
      shape=${args.shape}
      ?uppercase=${args.uppercase}
    >
      ${args.text}
    </ef-badge>
  `,
};