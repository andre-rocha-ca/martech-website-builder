"use client";

// ButtonGroup component with tracking
import { Button } from "@martech/design-system";
import { trackButtonClick } from "@/components/layout/SegmentScript";

export default function ButtonGroup() {
  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="default"
        size="lg"
        className="rounded-full bg-[#f9bd1d] px-8 py-3 text-[#20262b]"
        onClick={() => trackButtonClick("Button 1", "/page-1", { section: "Button Group" })}
      >
        Button 1
      </Button>
      <Button
        variant="default"
        size="lg"
        className="rounded-full bg-[#f9bd1d] px-8 py-3 text-[#20262b]"
        onClick={() => trackButtonClick("Button 2", "/page-1", { section: "Button Group" })}
      >
        Button 2
      </Button>
      <Button
        variant="default"
        size="lg"
        className="rounded-full bg-[#f9bd1d] px-8 py-3 text-[#20262b]"
        onClick={() => trackButtonClick("Button 3", "/page-1", { section: "Button Group" })}
      >
        Button 3
      </Button>
    </div>
  );
}
