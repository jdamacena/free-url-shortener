import { Check } from "lucide-react";

export default function Benefits() {
  const benefits = [
    "Easy to share on social media",
    "Cleaner look for presentations",
    "Save character space in messages",
    "Track clicks and engagement",
    "No registration required",
    "Works on all devices and platforms",
    "Ad-supported to keep the service free",
    "No hidden costs or premium features"
  ];

  return (
    <section id="benefits" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose LinkSnip?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our URL shortener provides numerous advantages for both casual users and professionals.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-3"
              >
                <div className="shrink-0 mt-1 p-1 rounded-full bg-primary/10">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}