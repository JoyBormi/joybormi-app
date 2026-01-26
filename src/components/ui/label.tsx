import * as LabelPrimitive from '@rn-primitives/label';
import * as React from 'react';

import Icons from '@/lib/icons';
import { cn } from '@/lib/utils';

const Label = React.forwardRef<
  LabelPrimitive.TextRef,
  LabelPrimitive.TextProps & { required?: boolean }
>(
  (
    {
      className,
      onPress,
      onLongPress,
      onPressIn,
      onPressOut,
      required,
      ...props
    },
    ref,
  ) => (
    <LabelPrimitive.Root
      className="web:cursor-default "
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <LabelPrimitive.Text
        ref={ref}
        className={cn(
          ' text-foreground relative web:peer-disabled:cursor-not-allowed web:peer-disabled:opacity-70',
          className,
        )}
      >
        {props.children}
        {required && (
          <Icons.Asterisk
            size={10}
            className="absolute right-0 top-0 -translate-y-[70%] text-destructive"
          />
        )}
      </LabelPrimitive.Text>
    </LabelPrimitive.Root>
  ),
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
