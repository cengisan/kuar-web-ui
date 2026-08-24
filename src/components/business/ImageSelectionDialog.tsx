"use client";

import { useCallback, useEffect, useState } from "react";
import { Globe, ImageIcon, Search, Upload } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  downloadPixabayImage,
  searchPixabayPhotos,
  type PixabayImage,
} from "@/services/pixabayService";

interface ImageSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectFile: (file: File) => void;
  initialSearchQuery?: string;
  translations: Record<string, string>;
}

export function ImageSelectionDialog({
  open,
  onOpenChange,
  onSelectFile,
  initialSearchQuery = "",
  translations,
}: ImageSelectionDialogProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [images, setImages] = useState<PixabayImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSearchQuery(initialSearchQuery);
      setImages([]);
    }
  }, [open, initialSearchQuery]);

  const runSearch = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) {
        toast.error(translations.enterSearchQuery);
        return;
      }

      setLoading(true);
      try {
        const result = await searchPixabayPhotos(trimmed, 20);
        if (!result.success) {
          toast.error(translations.imageSearchFailed);
          setImages([]);
          return;
        }

        if (result.images.length === 0) {
          toast.info(translations.noImagesFound);
        }
        setImages(result.images);
      } catch {
        toast.error(translations.imageSearchFailed);
        setImages([]);
      } finally {
        setLoading(false);
      }
    },
    [translations]
  );

  useEffect(() => {
    if (open && initialSearchQuery.trim()) {
      void runSearch(initialSearchQuery);
    }
  }, [open, initialSearchQuery, runSearch]);

  const handleSelectPixabayImage = async (image: PixabayImage) => {
    setDownloadingId(image.id);
    try {
      const file = await downloadPixabayImage(
        image.webformatURL,
        `pixabay_${image.id}.jpg`
      );
      onSelectFile(file);
      toast.success(translations.imageSelected);
      onOpenChange(false);
    } catch {
      toast.error(translations.imageDownloadFailed);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleLocalFile = (file: File | null) => {
    if (!file) return;
    onSelectFile(file);
    toast.success(translations.imageSelected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle>{translations.selectImage}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="stock" className="flex min-h-0 flex-1 flex-col">
          <TabsList className="mx-6 mt-4 grid w-auto grid-cols-2">
            <TabsTrigger value="stock" className="gap-2">
              <Globe className="size-4" />
              {translations.stockImages}
            </TabsTrigger>
            <TabsTrigger value="gallery" className="gap-2">
              <ImageIcon className="size-4" />
              {translations.gallery}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stock" className="mt-0 flex min-h-0 flex-1 flex-col px-6 pb-4">
            <div className="relative mt-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void runSearch(searchQuery);
                  }
                }}
                placeholder={translations.searchImages}
                className="pl-9 pr-24"
              />
              <Button
                type="button"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => void runSearch(searchQuery)}
                disabled={loading || !searchQuery.trim()}
              >
                {loading ? <Spinner size="sm" /> : translations.search}
              </Button>
            </div>

            <div className="mt-4 min-h-[320px] flex-1 overflow-y-auto">
              {loading && images.length === 0 ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center gap-3">
                  <Spinner size="lg" />
                  <p className="text-sm text-muted-foreground">
                    {translations.searchingImages}
                  </p>
                </div>
              ) : images.length === 0 ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center gap-2 px-6 text-center">
                  <ImageIcon className="size-12 text-muted-foreground" />
                  <p className="text-sm font-medium">{translations.searchForImages}</p>
                  <p className="text-xs text-muted-foreground">
                    {translations.poweredByPixabay}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {images.map((image) => {
                    const isDownloading = downloadingId === image.id;
                    return (
                      <button
                        key={image.id}
                        type="button"
                        disabled={Boolean(downloadingId)}
                        onClick={() => void handleSelectPixabayImage(image)}
                        className="group relative overflow-hidden rounded-xl border border-border bg-muted/30 text-left"
                      >
                        <img
                          src={image.thumbnail}
                          alt=""
                          className="aspect-square w-full object-cover transition-transform group-hover:scale-[1.02]"
                        />
                        {isDownloading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Spinner size="lg" className="text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="px-6 pb-6 pt-4">
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border px-6 py-10 text-center">
              <Upload className="size-10 text-muted-foreground" />
              <p className="max-w-sm text-sm text-muted-foreground">
                {translations.selectFromGallery}
              </p>
              <label htmlFor="image-selection-gallery-input">
                <Button type="button" asChild>
                  <span>{translations.openGallery}</span>
                </Button>
              </label>
              <input
                id="image-selection-gallery-input"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  handleLocalFile(e.target.files?.[0] ?? null);
                  e.target.value = "";
                }}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="border-t border-border px-6 py-3 text-center text-xs text-muted-foreground">
          {translations.pixabayCredit} • Pixabay
        </div>
      </DialogContent>
    </Dialog>
  );
}
