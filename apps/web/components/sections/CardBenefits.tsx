// CardBenefits component with tracking
import { Card, CardHeader, CardTitle, CardDescription } from "@martech/design-system";
import { trackEvent } from "@/components/layout/SegmentScript";

export default function CardBenefits() {
  return (
    <div className="flex flex-wrap gap-4">
      <Card className="bg-white p-4">
        <CardHeader>
          <CardTitle className="text-[#1b69c8]">Veja os números do seu negócio</CardTitle>
          <CardDescription className="text-[#35414b]">
            em relatórios simples, sem planilhas.
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="bg-white p-4">
        <CardHeader>
          <CardTitle className="text-[#1b69c8]">Dados financeiros</CardTitle>
          <CardDescription className="text-[#35414b]">
            vendas e estoque em relatórios centralizados no ERP.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
