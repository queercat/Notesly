import type { Meta, StoryObj } from "@storybook/react"

import { _StaticField } from "./_StaticField.tsx"

const meta: Meta<typeof _StaticField> = {
  title: "_StaticField",
  component: _StaticField,
}

export default meta

export const Primary: StoryObj<typeof _StaticField> = {
  render: () => <_StaticField>Static Field</_StaticField>,
}
