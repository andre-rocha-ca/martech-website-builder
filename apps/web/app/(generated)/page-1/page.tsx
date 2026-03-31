// Page component with tracking
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import FAQ from "@/components/sections/FAQ";
import ButtonGroup from "@/components/sections/ButtonGroup";
import CardBenefits from "@/components/sections/CardBenefits";
import { TrackedSection } from "@/components/sections/TrackedSection";

export default function Page() {
  return (
    <>
      <Navbar />
      <TrackedSection name="Hero">
        <Hero />
      </TrackedSection>
      <TrackedSection name="FAQ">
        <FAQ />
      </TrackedSection>
      <TrackedSection name="Button Group">
        <ButtonGroup />
      </TrackedSection>
      <TrackedSection name="Card Benefits">
        <CardBenefits />
      </TrackedSection>
    </>
  );
}
