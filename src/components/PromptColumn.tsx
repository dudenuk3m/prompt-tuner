import { useMemo } from "react";
import { encode, decode } from "gpt-tokenizer";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TOKEN_COLORS = [
  "bg-chart-1/30 text-chart-1",
  "bg-chart-2/30 text-chart-2",
  "bg-chart-3/30 text-chart-3",
  "bg-chart-4/30 text-chart-4",
  "bg-chart-5/30 text-chart-5",
];

interface Props {
  title: string;
  subtitle: string;
  variant: "raw" | "refined";
  value: string;
  onChange: (v: string) => void;
}

export function PromptColumn({ title, subtitle, variant, value, onChange }: Props) {
  const tokens = useMemo(() => encode(value), [value]);
  const pieces = useMemo(
    () =>
      tokens.map((t, i) => ({
        id: i,
        text: decode([t]),
        color: TOKEN_COLORS[i % TOKEN_COLORS.length],
      })),
    [tokens]
  );

  const chars = value.length;
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <Card className="flex flex-col gap-4 p-6 border-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge
              variant={variant === "refined" ? "default" : "secondary"}
              className="uppercase tracking-wider text-xs"
            >
              {variant === "refined" ? "Refined" : "Unrefined"}
            </Badge>
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold tabular-nums text-foreground">
            {tokens.length}
          </div>
          <div className="text-xs uppercase text-muted-foreground tracking-wider">
            tokens
          </div>
        </div>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className="font-mono text-sm resize-y"
      />

      <div className="flex gap-4 text-xs text-muted-foreground border-y py-2">
        <span><strong className="text-foreground">{chars}</strong> chars</span>
        <span><strong className="text-foreground">{words}</strong> words</span>
        <span><strong className="text-foreground">{tokens.length}</strong> tokens</span>
        <span className="ml-auto">
          ~{words ? (tokens.length / words).toFixed(2) : "0"} tok/word
        </span>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          Token visualization
        </div>
        <div className="flex flex-wrap gap-0.5 font-mono text-sm leading-relaxed p-3 rounded-md bg-muted/40 min-h-[100px]">
          {pieces.map((p) => (
            <span
              key={p.id}
              className={`px-1 py-0.5 rounded ${p.color} whitespace-pre`}
              title={`Token #${p.id}`}
            >
              {p.text.replace(/\n/g, "↵\n")}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
