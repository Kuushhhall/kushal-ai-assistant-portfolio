import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-dynamic';

type RawGraph = {
  nodes?: Array<{
    id: string;
    label?: string;
    community?: number;
    file_type?: string;
    source_file?: string;
  }>;
  edges?: Array<{
    source: string;
    target: string;
    relation?: string;
    confidence_score?: number;
    confidence?: string;
    weight?: number;
  }>;
};

export async function GET() {
  try {
    const graphPath = path.join(process.cwd(), 'graphify-out', 'graph.json');
    const raw = await fs.readFile(graphPath, 'utf8');
    const graph = JSON.parse(raw) as RawGraph;

    const nodes = (graph.nodes ?? []).map((n) => ({
      id: n.id,
      label: n.label ?? n.id,
      community: n.community ?? 0,
      file_type: n.file_type ?? 'unknown',
      source_file: n.source_file ?? '',
    }));

    const edges = (graph.edges ?? []).map((e) => ({
      source: e.source,
      target: e.target,
      relation: e.relation ?? '',
      confidence_score: e.confidence_score ?? null,
      confidence: e.confidence ?? '',
      weight: e.weight ?? 1,
    }));

    return NextResponse.json(
      { nodes, edges },
      {
        headers: {
          'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to load graph.json' },
      { status: 500 }
    );
  }
}
