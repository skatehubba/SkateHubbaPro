import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import { motion } from "framer-motion";

interface VideoUploadModalProps {
  open: boolean;
  onClose: () => void;
  challengeId: string;
  onUpload: (videoFile: File, description: string) => void;
}

export default function VideoUploadModal({ 
  open, 
  onClose, 
  challengeId, 
  onUpload 
}: VideoUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('video/')) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile, description);
      setSelectedFile(null);
      setDescription("");
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-testid="video-upload-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Upload Your Trick
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose}
              data-testid="button-close-upload-modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* File Upload Area */}
          <div 
            className={`video-upload-area rounded-lg p-8 text-center transition-colors ${
              isDragOver ? 'border-primary bg-primary/5' : ''
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            data-testid="video-upload-area"
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: isDragOver ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              {selectedFile ? (
                <div>
                  <p className="text-foreground font-medium mb-2">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-muted-foreground mb-2">Drag and drop your video here</p>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
                </>
              )}
              <input
                type="file"
                accept="video/*"
                onChange={handleFileInput}
                className="hidden"
                id="video-upload"
                data-testid="input-video-file"
              />
              <Label htmlFor="video-upload">
                <Button 
                  variant={selectedFile ? "secondary" : "default"}
                  className="cursor-pointer"
                  data-testid="button-choose-file"
                >
                  {selectedFile ? "Choose Different File" : "Choose File"}
                </Button>
              </Label>
            </motion.div>
          </div>
          
          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Trick Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your trick..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-input border-border"
              data-testid="input-trick-description"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleClose}
              data-testid="button-cancel-upload"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-accent"
              onClick={handleSubmit}
              disabled={!selectedFile}
              data-testid="button-submit-upload"
            >
              Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
