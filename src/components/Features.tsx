import { Zap, Shield, BarChart, Globe } from "lucide-react";

import { config } from "@/lib/config";

export default function Features() {
  // Base features that are always available
  const baseFeatures = [
    {
      icon: <Zap className="w-10 h-10 text-accent" />,
      title: "Instant Shortening",
      description: "Create short links in seconds with our lightning-fast URL shortening technology."
    },
    {
      icon: <Shield className="w-10 h-10 text-primary" />,
      title: "Secure & Reliable",
      description: "All links are securely processed and guaranteed to work reliably across all platforms."
    }
  ];

  // Optional features based on configuration
  const optionalFeatures = [
    config.features.analytics && {
      icon: <BarChart className="w-10 h-10 text-secondary" />,
      title: "Simple Analytics",
      description: "See how your links are performing with our easy-to-understand click tracking."
    },
    config.features.adSupported && {
      icon: <Globe className="w-10 h-10 text-primary" />,
      title: "Free Forever",
      description: "Our ad-supported model means you'll never pay a cent to use our core shortening features."
    }
  ].filter(Boolean);

  const features = [...baseFeatures, ...optionalFeatures];

  return (
    <section id="features" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            LinkSnip offers everything you need for efficient URL shortening, with no complicated setup or hidden costs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-card border border-border rounded-lg p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4 p-3 rounded-full bg-primary/10 w-fit">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}