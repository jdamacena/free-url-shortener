import { ArrowRight, Link, Share2, Scissors } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Link className="w-10 h-10 text-primary" />,
      title: "Paste Your URL",
      description: "Enter the long URL you want to shorten in the input field."
    },
    {
      icon: <Scissors className="w-10 h-10 text-accent" />,
      title: "Shorten It",
      description: "Click the 'Shorten URL' button to generate your short link instantly."
    },
    {
      icon: <Share2 className="w-10 h-10 text-secondary" />,
      title: "Share Your Link",
      description: "Copy your shortened URL and share it anywhere you want."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our URL shortener is simple to use. Follow these three easy steps to create and share your shortened links.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center bg-card border border-border rounded-lg p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4 p-3 rounded-full bg-primary/10">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="hidden md:flex justify-center items-center mt-8">
          <ArrowRight className="w-6 h-6 text-muted-foreground mx-4" />
          <ArrowRight className="w-6 h-6 text-muted-foreground mx-4" />
        </div>
      </div>
    </section>
  );
}