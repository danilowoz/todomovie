"use client";
import "./tooltip.css";

import * as TooltipRadix from "@radix-ui/react-tooltip";

export const Tooltip = ({
  children,
  trigger,
}: {
  children: React.ReactNode;
  trigger: React.ReactNode;
}) => (
  <TooltipRadix.Provider disableHoverableContent>
    <TooltipRadix.Root>
      <TooltipRadix.Trigger asChild>{trigger}</TooltipRadix.Trigger>
      <TooltipRadix.Portal>
        <TooltipRadix.Content className="TooltipContent" sideOffset={5}>
          <TooltipRadix.Arrow className="TooltipArrow" />

          {children}
        </TooltipRadix.Content>
      </TooltipRadix.Portal>
    </TooltipRadix.Root>
  </TooltipRadix.Provider>
);
