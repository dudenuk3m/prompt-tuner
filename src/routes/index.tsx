import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { encode } from "gpt-tokenizer";
import { PromptColumn } from "@/components/PromptColumn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Tokenwise — Learn Prompt Tokenization" },
      {
        name: "description",
        content:
          "Compare unrefined vs refined prompts side-by-side and see how token count changes while keeping the same outcome.",
      },
    ],
  }),
});

const EXAMPLES = [
  {
    name: "Summarize an article",
    raw: "Hi there! I was wondering if you could possibly, if it's not too much trouble, take a look at the following article that I'm going to paste below and then maybe write me a sort of summary of what it's about, kind of like the main points, in a few sentences please. Thank you so much in advance!",
    refined: "Summarize the article below in 3 bullet points.",
  },
  {
    name: "Translate to French",
    raw: "Could you be so kind as to take the English sentence that I will provide to you and convert it, translating it carefully, into the French language for me?",
    refined: "Translate to French:",
  },
  {
    name: "Generate SQL",
    raw: "I have a database table called users and I want to know how I would write a SQL query that returns to me all the users that signed up in the last 30 days, ordered by signup date descending.",
    refined: "Write SQL: users signed up in last 30 days, order by signup_date desc.",
  },
];

function Index() {
  const [idx, setIdx] = useState(0);
  const [raw, setRaw] = useState(EXAMPLES[0].raw);
  const [refined, setRefined] = useState(EXAMPLES[0].refined);

  const loadExample = (i: number) => {
    setIdx(i);
    setRaw(EXAMPLES[i].raw);
    setRefined(EXAMPLES[i].refined);
  };

  const rawCount = encode(raw).length;
  const refinedCount = encode(refined).length;
  const saved = rawCount - refinedCount;
  const pct = rawCount > 0 ? Math.round((saved / rawCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold">
              T
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Tokenwise</h1>
              <p className="text-sm text-muted-foreground">
                Learn how prompt tokenization works — same outcome, fewer tokens.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Card className="p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground mr-2">
              Try an example:
            </span>
            {EXAMPLES.map((ex, i) => (
              <Button
                key={ex.name}
                variant={idx === i ? "default" : "outline"}
                size="sm"
                onClick={() => loadExample(i)}
              >
                {ex.name}
              </Button>
            ))}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <PromptColumn
            title="Wordy version"
            subtitle="Polite filler, hedging, redundant context"
            variant="raw"
            value={raw}
            onChange={setRaw}
          />
          <PromptColumn
            title="Tight version"
            subtitle="Direct instruction, same intent"
            variant="refined"
            value={refined}
            onChange={setRefined}
          />
        </div>

        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <Stat label="Unrefined tokens" value={rawCount} />
            <Stat label="Refined tokens" value={refinedCount} />
            <Stat
              label="Tokens saved"
              value={saved}
              accent={saved > 0 ? "good" : saved < 0 ? "bad" : undefined}
            />
            <Stat
              label="Reduction"
              value={`${pct}%`}
              accent={pct > 0 ? "good" : pct < 0 ? "bad" : undefined}
            />
          </div>
        </Card>

        <Card className="p-6 space-y-3">
          <h3 className="font-semibold text-lg">Why this matters</h3>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>
              LLMs charge per <strong>token</strong>, not per word. ~4 chars ≈ 1 token in English.
            </li>
            <li>
              Pleasantries ("could you please", "thank you so much") add tokens without changing the answer.
            </li>
            <li>
              Shorter prompts also mean faster responses and more room for the model's reply within the context window.
            </li>
            <li>
              Edit either side above — the counter and colored token map update in real time.
            </li>
          </ul>
        </Card>
      </main>

      <footer className="border-t mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-xs text-muted-foreground">
          Tokenization uses the GPT (cl100k / o200k) BPE tokenizer.
        </div>
      </footer>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: "good" | "bad";
}) {
  const color =
    accent === "good"
      ? "text-chart-2"
      : accent === "bad"
        ? "text-destructive"
        : "text-foreground";
  return (
    <div>
      <div className={`text-3xl md:text-4xl font-bold tabular-nums ${color}`}>
        {value}
      </div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
        {label}
      </div>
    </div>
  );
}
