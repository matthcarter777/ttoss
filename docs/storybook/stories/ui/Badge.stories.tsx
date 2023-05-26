import { Badge, BadgeProps, Flex } from '@ttoss/ui';
import { ComponentMeta, Story } from '@storybook/react';

export default {
  title: 'UI/Badge',
  component: Badge,
} as ComponentMeta<typeof Badge>;

const Template: Story<BadgeProps> = (args) => {
  return (
    <Flex
      sx={{
        gap: 'md',
        flexDirection: 'column',
        alignItems: 'start',
      }}
    >
      <Badge {...args}>Label</Badge>
      <Badge {...args} icon="radio-not-selected">
        Label
      </Badge>
    </Flex>
  );
};

export const Positive = Template.bind({});

Positive.args = {
  variant: 'positive',
};

export const Negative = Template.bind({});

Negative.args = {
  variant: 'negative',
};

export const Neutral = Template.bind({});

Neutral.args = {
  variant: 'neutral',
};

export const Informative = Template.bind({});

Informative.args = {
  variant: 'informative',
};

export const Muted = Template.bind({});

Muted.args = {
  variant: 'muted',
};
