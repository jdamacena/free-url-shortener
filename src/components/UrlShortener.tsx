"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { validateAndSanitizeUrl, validateCustomShortUrl } from "@/lib/validation";


interface UrlShortenerProps {
  urlInputRef: React.RefObject<HTMLInputElement>;
}

export default function UrlShortener({ urlInputRef }: UrlShortenerProps) {
  const [url, setUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");
  const { toast } = useToast();

  // Update preview URL as user types
  const handleUrlChange = (input: string) => {
    setUrl(input);
    
    // Clean up the input
    let cleanInput = input.trim().toLowerCase();
    
    // Remove common prefixes if user pastes them
    cleanInput = cleanInput
      .replace(/^(https?:\/\/)?(www\.)?/i, '')
      .replace(/\s+/g, '');
    
    // Show preview with https://
    if (cleanInput) {
      const preview = `https://${cleanInput}`;
      setPreviewUrl(preview);
    } else {
      setPreviewUrl("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use the preview URL for validation
    const validation = validateAndSanitizeUrl(previewUrl);
    if (!validation.isValid) {
      toast({
        title: "Invalid URL",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    // Validate custom URL if provided
    if (customUrl) {
      const customValidation = validateCustomShortUrl(customUrl);
      if (!customValidation.isValid) {
        toast({
          title: "Invalid Custom URL",
          description: customValidation.error,
          variant: "destructive",
        });
        return;
      }
    }

    // Call the API to shorten the URL
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: previewUrl,
          customUrl: customUrl || undefined
        }),
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
    if (shortUrl && urlInputRef.current) {
      try {
        await navigator.clipboard.writeText(shortUrl);
        urlInputRef.current.select();
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
    setCustomUrl("");
    setShortUrl(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!shortUrl ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Type or paste your URL (e.g., google.com)"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="flex-1"
                  required
                  ref={urlInputRef}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    {`${config.brand.domain}${config.url.shortUrlPath}/`}
                  </span>
                  <Input
                    type="text"
                    placeholder="Custom URL (optional)"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="pl-[calc(1rem+180px)]"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                variant="hero" 
                size="lg"
                disabled={isLoading || !url.trim()}
                className="min-w-[140px]"
              >
                {isLoading ? "Shortening..." : "Shorten URL"}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mt-6 bg-card border border-border rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-2">Your shortened URL</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              ref={urlInputRef}
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
        </div>
      )}
    </div>
  );
}