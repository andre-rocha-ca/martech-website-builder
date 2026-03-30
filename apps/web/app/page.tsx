import { Button, Badge, Separator } from "@martech/design-system";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <Badge variant="secondary" className="mb-4">
          Automated Pipeline
        </Badge>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Martech Website Builder
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Automated Figma-to-Next.js page builder with Segment CDP tracking, deployed on AWS
          Amplify. Powered by shadcn/ui components.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" asChild>
            <a href="/api/health">Check Health</a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </Button>
        </div>
        <Separator className="my-8" />
        <p className="text-muted-foreground text-sm">
          Publish a design in Figma and pages appear here automatically.
        </p>
      </div>
    </main>
  );
}
