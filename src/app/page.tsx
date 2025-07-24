import Header from "@/components/Header";
import UrlShortener from "@/components/UrlShortener";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Benefits from "@/components/Benefits";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import Image from "next/image";
import heroBg from "@/assets/hero-bg.jpg";
import { ToastButton } from "@/components/ToastButton";
import { config } from "@/lib/config";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <ToastButton />
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image 
            src={heroBg} 
            alt="Background" 
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-1">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Shorten Your Links</span>{" "}
              <span>for Free!</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {config.brand.description}
            </p>
            
            {/* URL Shortener Component */}
            <UrlShortener />
            
            {/* Example */}
            <div className="mt-8 inline-flex items-center p-3 bg-muted/50 rounded-md text-sm text-muted-foreground">
              <span className="mr-2">Example:</span>
              <span className="line-through">https://example.com/very/long/path/to/page?param=value&amp;another=123</span>
              <span className="mx-2">→</span>
              <span className="font-medium text-foreground">{config.brand.domain}/a1b2c3</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <Features />
      
      {/* How It Works Section */}
      <HowItWorks />
      
      {/* Benefits Section */}
      <Benefits />
      
      {/* CTA Section */}
      <Cta />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
