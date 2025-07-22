import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Cta() {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Shorten Your URLs?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Start creating short, memorable links in seconds. No registration required. 
          Just paste your URL and get a shortened version instantly.
        </p>
        <Button 
          variant="hero" 
          size="xl" 
          onClick={handleScrollToTop}
          className="group"
        >
          Start Shortening Now 
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </section>
  );
}