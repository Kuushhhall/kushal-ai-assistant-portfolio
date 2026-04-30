'use client';

import * as React from 'react';
import { DataSet, Network } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.min.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Copy, Search } from 'lucide-react';
import { toast } from 'sonner';

type GraphPayload = {
  nodes: Array<{
    id: string;
    label: string;
    community: number;
    file_type: string;
    source_file: string;
  }>;
  edges: Array<{
    source: string;
    target: string;
    relation: string;
    confidence_score: number | null;
    confidence: string;
    weight: number;
  }>;
};

const COMMUNITY_COLORS = [
  '#4E79A7',
  '#F28E2B',
  '#E15759',
  '#76B7B2',
  '#59A14F',
  '#EDC948',
  '#B07AA1',
  '#FF9DA7',
  '#9C755F',
  '#BAB0AC',
];

function colorForCommunity(community: number) {
  const idx = Math.abs(community) % COMMUNITY_COLORS.length;
  return COMMUNITY_COLORS[idx];
}

function shortPath(p: string) {
  if (!p) return '';
  const parts = p.split(/[/\\\\]/g);
  return parts.slice(-2).join('/');
}

export default function GraphViewer({ open }: { open: boolean }) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const networkRef = React.useRef<Network | null>(null);
  type VisNode = {
    id: string;
    label: string;
    color: {
      background: string;
      border: string;
      highlight: { background: string; border: string };
    };
    font: { size: number };
    shape: 'dot';
    size: number;
    _meta: GraphPayload['nodes'][number];
  };

  type VisEdge = {
    id: number;
    from: string;
    to: string;
    arrows: { to: { enabled: boolean } };
    color: { color: string };
    width: number;
    title: string;
  };

  const nodesRef = React.useRef<DataSet<VisNode> | null>(null);
  const edgesRef = React.useRef<DataSet<VisEdge> | null>(null);

  const [data, setData] = React.useState<GraphPayload | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [query, setQuery] = React.useState('');
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open || data || loading) return;
    setLoading(true);
    setError(null);
    fetch('/api/graph')
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(() => setError('Failed to load graph'))
      .finally(() => setLoading(false));
  }, [open, data, loading]);

  React.useEffect(() => {
    if (!open) return;
    if (!data) return;
    if (!containerRef.current) return;

    const nodesDS = new DataSet<VisNode>(
      data.nodes.map((n) => {
        const c = colorForCommunity(n.community);
        return {
          id: n.id,
          label: n.label,
          color: {
            background: c,
            border: c,
            highlight: { background: '#ffffff', border: c },
          },
          font: { size: 14 },
          shape: 'dot',
          size: 10,
          _meta: n,
        };
      })
    );

    const edgesDS = new DataSet<VisEdge>(
      data.edges.map((e, i) => ({
        id: i,
        from: e.source,
        to: e.target,
        arrows: { to: { enabled: false } },
        color: { color: 'rgba(120,120,120,0.35)' },
        width: 1,
        title: e.relation ? `${e.relation}` : '',
      }))
    );

    nodesRef.current = nodesDS;
    edgesRef.current = edgesDS;

    const network = new Network(
      containerRef.current,
      { nodes: nodesDS, edges: edgesDS },
      {
        physics: {
          enabled: true,
          solver: 'forceAtlas2Based',
          forceAtlas2Based: {
            gravitationalConstant: -60,
            centralGravity: 0.01,
            springLength: 120,
            springConstant: 0.08,
            damping: 0.45,
            avoidOverlap: 0.8,
          },
          stabilization: { iterations: 220, fit: true },
        },
        interaction: {
          hover: true,
          tooltipDelay: 120,
          hideEdgesOnDrag: true,
        },
        nodes: { borderWidth: 1.5 },
        edges: { smooth: { enabled: true, type: 'continuous', roundness: 0.15 } },
      }
    );

    networkRef.current = network;

    network.once('stabilizationIterationsDone', () => {
      network.setOptions({ physics: { enabled: false } });
    });

    network.on('click', (params) => {
      const nodeId = params?.nodes?.[0];
      if (nodeId) {
        setSelectedId(String(nodeId));
      }
    });

    return () => {
      network.destroy();
      networkRef.current = null;
      nodesRef.current = null;
      edgesRef.current = null;
    };
  }, [open, data]);

  const selected = React.useMemo(() => {
    if (!selectedId || !nodesRef.current) return null;
    const node = nodesRef.current.get(selectedId);
    return node?._meta ?? null;
  }, [selectedId]);

  const neighbors = React.useMemo(() => {
    if (!selectedId || !networkRef.current || !nodesRef.current) return [];
    const ids = networkRef.current.getConnectedNodes(selectedId) as Array<
      string | number
    >;
    return ids
      .map((id) => nodesRef.current!.get(id))
      .filter(Boolean)
      .map((n) => ({ id: String(n.id), label: String(n.label) }))
      .slice(0, 60);
  }, [selectedId]);

  const results = React.useMemo(() => {
    if (!query.trim() || !data) return [];
    const q = query.toLowerCase();
    return data.nodes
      .filter(
        (n) =>
          n.label.toLowerCase().includes(q) || n.id.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [query, data]);

  const focusNode = (id: string) => {
    setSelectedId(id);
    networkRef.current?.focus(id, { scale: 1.2, animation: true });
    networkRef.current?.selectNodes([id]);
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied');
    } catch {
      toast.error('Copy failed');
    }
  };

  return (
    <div className="grid h-full grid-cols-1 md:grid-cols-[1fr_340px]">
      <div className="relative h-full min-h-[320px] bg-background">
        <div ref={containerRef} className="h-full w-full" />
        {loading && (
          <div className="text-muted-foreground absolute inset-0 grid place-items-center text-sm">
            Loading graph…
          </div>
        )}
        {error && (
          <div className="text-destructive absolute inset-0 grid place-items-center text-sm">
            {error}
          </div>
        )}
      </div>

      <aside className="flex h-full flex-col border-t md:border-t-0 md:border-l">
        <div className="flex-shrink-0 border-b p-3">
          <div className="relative">
            <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search nodes…"
              className="pl-9"
            />
          </div>

          {results.length > 0 && (
            <div className="mt-2 rounded-lg border bg-card p-2">
              {results.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => focusNode(r.id)}
                  className={cn(
                    'w-full rounded-md px-2 py-1 text-left text-sm',
                    'hover:bg-accent'
                  )}
                >
                  <div className="truncate font-medium">{r.label}</div>
                  <div className="text-muted-foreground truncate text-xs">{r.id}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-3">
          <div className="text-muted-foreground mb-2 text-xs">Node details</div>

          {!selected ? (
            <div className="text-muted-foreground text-sm">
              Click a node to inspect it.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl border bg-card p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{selected.label}</div>
                    <div className="text-muted-foreground truncate text-xs">{selected.id}</div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => copy(selected.id)}
                    aria-label="Copy node id"
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>

                <div className="mt-3 grid gap-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground text-xs">Type</span>
                    <span className="truncate text-xs">{selected.file_type}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground text-xs">Source</span>
                    <span className="truncate text-xs">{shortPath(selected.source_file)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground text-xs">Community</span>
                    <span className="truncate text-xs">{selected.community}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-3">
                <div className="mb-2 text-sm font-medium">Neighbors</div>
                {neighbors.length === 0 ? (
                  <div className="text-muted-foreground text-sm">None</div>
                ) : (
                  <div className="space-y-1">
                    {neighbors.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => focusNode(n.id)}
                        className="hover:bg-accent w-full rounded-md px-2 py-1 text-left text-sm"
                      >
                        <div className="truncate">{n.label}</div>
                        <div className="text-muted-foreground truncate text-xs">{n.id}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="text-muted-foreground flex-shrink-0 border-t px-3 py-2 text-xs">
          Tip: scroll / pinch to zoom, drag to pan
        </div>
      </aside>
    </div>
  );
}
