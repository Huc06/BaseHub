import { NextResponse } from "next/server";

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get("word");
  const start = searchParams.get("start"); // prefix mode for candidates
  const max = Math.min(parseInt(searchParams.get("max") || "50", 10) || 50, 200);

  // Mode 1: candidates by prefix
  if (start && start.trim()) {
    const prefix = normalize(start).slice(0, 3); // safety cap
    try {
      const dm = await fetch(
        `https://api.datamuse.com/words?sp=${encodeURIComponent(prefix)}*&md=f&max=${max}`,
        { next: { revalidate: 60 * 60 } }
      );
      if (!dm.ok) {
        return NextResponse.json({ words: [] }, { status: 200 });
      }
      const list: Array<{ word: string; tags?: string[] }> = await dm.json();
      const words = list
        .map((it) => ({
          word: normalize(it.word),
          freq: parseFloat((it.tags || []).find((t) => t.startsWith("f:"))?.slice(2) || "0"),
        }))
        .filter((w) => w.word.startsWith(prefix));
      return NextResponse.json({ words, source: "datamuse" });
    } catch (err) {
      return NextResponse.json({ words: [], error: (err as Error).message }, { status: 200 });
    }
  }

  // Mode 2: validity check for a specific word
  if (!word || !word.trim()) {
    return NextResponse.json(
      { valid: false, error: "Missing 'word' or 'start' query param" },
      { status: 400 }
    );
  }

  const q = normalize(word);
  try {
    // Primary: Free Dictionary API
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(q)}`,
      { next: { revalidate: 60 * 60 * 24 } }
    );

    if (res.ok) {
      const data = await res.json();
      const valid = Array.isArray(data) && data.length > 0;
      return NextResponse.json({ valid, source: "dictionaryapi", data: valid ? data[0] : null });
    }

    // Fallback: Datamuse
    const dm = await fetch(
      `https://api.datamuse.com/words?sp=${encodeURIComponent(q)}&max=1`,
      { next: { revalidate: 60 * 60 * 24 } }
    );
    if (dm.ok) {
      const list = await dm.json();
      const valid = Array.isArray(list) && list.length > 0 && normalize(list[0].word) === q;
      return NextResponse.json({ valid, source: "datamuse" });
    }

    return NextResponse.json({ valid: false, source: "none" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ valid: false, error: "Lookup failed" }, { status: 200 });
  }
}


