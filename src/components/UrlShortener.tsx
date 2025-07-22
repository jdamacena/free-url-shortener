import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const isValidUrl = (urlString: string) => {
    try {
      return Boolean(new URL(urlString));
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "URL is required",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      });
      return;
    }

    if (!isValidUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive",
      });
      return;
    }

    // Mock URL shortening for demonstration
    setIsLoading(true);
    
    // Simulating API call with a timeout
    setTimeout(() => {
      // Generate a mock short URL (in a real app, this would come from a backend)
      const mockShortId = Math.random().toString(36).substring(2, 8);
      const mockShortUrl = `https://linksnip.com/${mockShortId}`;
      
      setShortUrl(mockShortUrl);
      setIsLoading(false);
      
      toast({
        title: "URL shortened successfully!",
        description: "Your short link is ready to share",
      });
    }, 1000);
  };

  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      toast({
        title: "Copied to clipboard!",
        description: "Your short URL is copied and ready to share",
      });
    }
  };

  const handleReset = () => {
    setUrl("");
    setShortUrl(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!shortUrl ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="url"
            placeholder="Paste your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
            required
          />
          <Button 
            type="submit" 
            variant="hero" 
            size="lg"
            disabled={isLoading}
            className="min-w-[140px]"
          >
            {isLoading ? "Shortening..." : "Shorten URL"}
          </Button>
        </form>
      ) : (
        <div className="mt-6 bg-card border border-border rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-2">Your shortened URL</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={shortUrl}
              readOnly
              className="flex-1 font-medium"
            />
            <div className="flex gap-2">
              <Button 
                variant="gradient" 
                size="default" 
                onClick={handleCopy}
                className="min-w-[100px]"
              >
                Copy
              </Button>
              <Button 
                variant="outline" 
                size="default" 
                onClick={handleReset}
              >
                New
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            This link will show an ad page before redirecting to your original URL.
          </p>
        </div>
      )}
    </div>
  );
}