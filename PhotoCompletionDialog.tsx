import { useState, useCallback } from "react";
import { Camera, Upload, X, Check, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface PhotoCompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (photos?: string[]) => void;
  jobId: string;
  jobDescription?: string;
}

export function PhotoCompletionDialog({ 
  isOpen, 
  onClose, 
  onContinue, 
  jobId,
  jobDescription 
}: PhotoCompletionDialogProps) {
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a valid image file`,
          variant: "destructive"
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 10MB size limit`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    // Limit to 5 photos total
    const currentCount = selectedPhotos.length;
    const remainingSlots = 5 - currentCount;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (filesToAdd.length < validFiles.length) {
      toast({
        title: "Photo limit reached",
        description: "Maximum 5 photos allowed per job completion",
        variant: "destructive"
      });
    }

    // Create preview URLs
    const newPreviewUrls = filesToAdd.map(file => URL.createObjectURL(file));
    
    setSelectedPhotos(prev => [...prev, ...filesToAdd]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  }, [selectedPhotos.length, toast]);

  const handleRemovePhoto = useCallback((index: number) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  }, [previewUrls]);

  const handleContinueWithPhotos = useCallback(async () => {
    if (selectedPhotos.length === 0) {
      onContinue();
      return;
    }

    setIsUploading(true);
    
    try {
      // For now, we'll simulate photo upload by creating mock URLs
      // In a real implementation, you would upload to a cloud storage service
      const photoUrls = selectedPhotos.map((_, index) => 
        `photo_${jobId}_${Date.now()}_${index + 1}.jpg`
      );

      toast({
        title: "Photos uploaded successfully",
        description: `${selectedPhotos.length} photo(s) added to job completion`,
      });

      onContinue(photoUrls);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload photos. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }, [selectedPhotos, jobId, onContinue, toast]);

  const handleContinueWithoutPhotos = useCallback(() => {
    onContinue();
  }, [onContinue]);

  const handleClose = useCallback(() => {
    // Clean up preview URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setSelectedPhotos([]);
    setPreviewUrls([]);
    onClose();
  }, [previewUrls, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Camera className="w-5 h-5 text-blue-600" />
            Complete Job - Add Photos?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Job Info */}
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-slate-900">Job Completion</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    You're about to mark this job as completed. Would you like to add completion photos?
                  </p>
                  {jobDescription && (
                    <p className="text-sm text-slate-500 mt-1 font-mono">
                      {jobDescription}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo Upload Section */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-slate-900">
              Completion Photos (Optional)
            </h3>
            
            {/* Upload Button */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => document.getElementById('photo-upload')?.click()}
                disabled={selectedPhotos.length >= 5}
              >
                <Upload className="w-4 h-4" />
                {selectedPhotos.length === 0 ? 'Add Photos' : 'Add More Photos'}
              </Button>
              <span className="text-sm text-slate-500 self-center">
                {selectedPhotos.length}/5 photos
              </span>
            </div>

            <input
              id="photo-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Photo Previews */}
            {selectedPhotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-slate-200"
                    />
                    <button
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selectedPhotos.length === 0 && (
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 mb-2">No photos selected</p>
                <p className="text-sm text-slate-500">
                  Photos help document job completion and quality
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleContinueWithoutPhotos}
              className="flex-1"
              disabled={isUploading}
            >
              Complete Without Photos
            </Button>
            <Button
              onClick={handleContinueWithPhotos}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Complete Job {selectedPhotos.length > 0 ? `(${selectedPhotos.length} photos)` : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}