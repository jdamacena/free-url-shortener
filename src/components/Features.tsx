import { Zap, Shield, BarChart, Globe, Link } from "lucide-react";
import { config } from "@/lib/config";

export default function Features() {
  // Map of icon names to components
  const iconMap = {
    Zap: <Zap className="w-10 h-10 text-accent" />,
    Shield: <Shield className="w-10 h-10 text-primary" />,
    Link: <Link className="w-10 h-10 text-secondary" />,
    BarChart: <BarChart className="w-10 h-10 text-secondary" />,
    Globe: <Globe className="w-10 h-10 text-primary" />
  };

  // Map the features from config and convert icon strings to components
  const features = config.content.features.map(feature => ({
    ...feature,
    icon: iconMap[feature.icon as keyof typeof iconMap]
  }));

  return (
    <section id="features" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            LinkSnip offers everything you need for efficient URL shortening, with no complicated setup or hidden costs.
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${features.length <= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-8 ${features.length <= 3 ? 'max-w-5xl mx-auto' : ''}`}>
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