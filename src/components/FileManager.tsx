import React, {} from 'react';
import { File, Folder, Image } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface StorageItem {
  id: string;
  name: string;
  type: "file" | "folder" | "image";
  size?: string;
  modified: string;
}

interface FileManagerProps {
  items?: StorageItem[];
  onUpload?: () => void;
  onCreateFolder?: () => void;
  onItemSelect?: (itemId: string) => void;
}

const FileManager: React.FC<FileManagerProps> = ({
  items: propItems,
  onUpload,
  onCreateFolder,
  onItemSelect
}) => {
  const defaultItems: StorageItem[] = [
    { id: "1", name: "Documents", type: "folder", modified: "2 hours ago" },
    { id: "2", name: "Images", type: "folder", modified: "5 hours ago" },
    { id: "3", name: "profile-photo.jpg", type: "image", size: "2.4 MB", modified: "1 day ago" },
    { id: "4", name: "report.pdf", type: "file", size: "1.8 MB", modified: "2 days ago" }
  ];

  const items = propItems || defaultItems;

  const getIcon = (type: string) => {
    switch (type) {
      case "folder":
        return <Folder className="h-8 w-8 text-blue-500" />;
      case "image":
        return <Image className="h-8 w-8 text-green-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>File Manager</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onCreateFolder}>
              New Folder
            </Button>
            <Button size="sm" onClick={onUpload}>
              Upload
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onItemSelect?.(item.id)} role="button" tabIndex={0}
            >
              {getIcon(item.type)}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.size ? `${item.size} • ` : ""}Modified {item.modified}
                </p>
              </div>
              <Badge variant="secondary">{item.type}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileManager;
