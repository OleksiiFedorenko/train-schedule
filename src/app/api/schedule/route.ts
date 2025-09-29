import { NextResponse } from "next/server";
import type { TrainRow } from "@/lib/types";

let rows: TrainRow[] = [
  { id: "1", number: "082К", from: "Kyiv", to: "Lviv",  departure: "12:15", arrival: "16:40" },
  { id: "2", number: "705О", from: "Kyiv", to: "Odesa", departure: "13:10", arrival: "18:05" },
];

export async function GET() {
  return NextResponse.json(rows);
}

export async function PATCH(req: Request) {
  const body = await req.json() as Partial<TrainRow> & { id: string };
  rows = rows.map(r => r.id === body.id ? { ...r, ...body } : r);
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  const body = (await req.json()) as Omit<TrainRow, "id">;
  const newRow: TrainRow = { id: String(Date.now()), ...body };
  rows.push(newRow);
  return NextResponse.json(newRow, { status: 201 });
}