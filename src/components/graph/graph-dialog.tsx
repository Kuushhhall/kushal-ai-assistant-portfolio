'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { X, Waypoints } from 'lucide-react';
import GraphViewer from './graph-viewer';

export default function GraphDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Waypoints className="size-4" />
          Graph
        </Button>
      </DialogTrigger>

      <DialogContent className="h-[90dvh] max-w-[min(1100px,calc(100%-2rem))] p-0">
        <div className="flex h-full flex-col overflow-hidden">
          <DialogHeader className="flex-shrink-0 border-b px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <DialogTitle className="truncate">Knowledge Graph</DialogTitle>
                <div className="text-muted-foreground text-xs">
                  Search nodes, inspect details, and explore neighbors
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X className="size-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="min-h-0 flex-1">
            <GraphViewer open={open} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

