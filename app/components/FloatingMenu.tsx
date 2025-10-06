import React from 'react';
import { FloatingAction } from 'react-native-floating-action';

type Action = {
  text: string;
  icon?: any;
  name: string;
  position?: number;
};

type Props = {
  actions: Action[];
  color?: string;
  floatingIcon?: any;
  iconHeight?: number;
  iconWidth?: number;
  onPressItem?: (name?: string) => void;
};

export default function FloatingMenu({ actions, color, floatingIcon, iconHeight, iconWidth, onPressItem }: Props) {
  return (
    <FloatingAction
      actions={actions}
      color={color || '#007bff'}
      floatingIcon={floatingIcon}
      iconHeight={iconHeight}
      iconWidth={iconWidth}
      onPressItem={onPressItem}
    />
  );
}
