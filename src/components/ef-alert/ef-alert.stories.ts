import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../index.ts';
import { iconNames } from '../../assets/icons/icon-types';
import { colorValues, shapeValues } from '../../tokens/';

const meta: Meta = {
  title: 'Components/ef-alert',
  component: 'ef-alert',

  args: {
    color: 'primary',
    duration: null, 
    dissmissable: false,
    icon: null,
    shape: 'rounded',
    static: true,
    variant: 'solid',
    heading: "Heading Text",
    text: 'Body Text',
  },

  argTypes: {
    heading: { control: 'text' },
    text: { control: 'text' },

    color: {
      control: 'select',
      options: colorValues,
    },
    duration: {
      control: 'text',
    },
    dissmissable: {
      control: 'boolean',
    },
    icon: {
      control: 'select',
      options: iconNames,
    },
    shape: {
      control: 'select',
      options: shapeValues,
    },
    static: {
      control: 'boolean',
    },
    variant: {
      control: 'select',
      options: ['solid', 'outline'],
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <ef-alert
      color=${args.color}
      ?dissmissable=${args.dissmissable}
      ?duration=${args.duration}
      ?icon=${args.icon}
      ?static=${args.static}
      shape=${args.shape}
      variant=${args.variant}
    >
      <h4 slot="title">${args.heading}</h4>
      ${args.text}
      <ef-button slot="actions" shape="pill">Action</ef-button>
    </ef-alert>
  `,
};
