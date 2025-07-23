"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { validateAndSanitizeUrl } from "@/lib/validation";

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateAndSanitizeUrl(url);
    if (!validation.isValid) {
      toast({
        title: "Invalid URL",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    // Call the API to shorten the URL
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL');
      }

      setShortUrl(data.shortUrl);
      
      toast({
        title: "URL shortened successfully!",
        description: "Your short link is ready to share",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to shorten URL",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (shortUrl && inputRef.current) {
      try {
        await navigator.clipboard.writeText(shortUrl);
        inputRef.current.select();
        setCopyStatus("success");
        setTimeout(() => setCopyStatus("idle"), 2000);
      } catch (error) {
        setCopyStatus("error");
        setTimeout(() => setCopyStatus("idle"), 2000);
      }
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
              ref={inputRef}
              value={shortUrl}
              readOnly
              className="flex-1 font-medium"
            />
            <div className="flex gap-2">
              <Button 
                variant={copyStatus === "error" ? "destructive" : "gradient"}
                size="default" 
                onClick={handleCopy}
                className={`min-w-[100px] transition-all ${
                  copyStatus === "success" ? "bg-green-600 hover:bg-green-700" : ""
                }`}
              >
                {copyStatus === "idle" && "Copy"}
                {copyStatus === "success" && "Copied! ✓"}
                {copyStatus === "error" && "Try again"}
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