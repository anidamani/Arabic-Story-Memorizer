import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { VocabWord } from "@/data/vocabulary";

interface VocabularyCardProps {
  word: VocabWord;
  hideArabic: boolean;
  hideFrench: boolean;
  index: number;
}

function getTypeColor(type: VocabWord["type"]): string {
  switch (type) {
    case "verb": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case "noun": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
    case "adjective": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
    case "adverb": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
    case "preposition": return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300";
    case "color": return "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300";
    default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
}

function getTypeLabel(type: VocabWord["type"]): string {
  switch (type) {
    case "verb": return "Verbe";
    case "noun": return "Nom";
    case "adjective": return "Adj.";
    case "adverb": return "Adv.";
    case "preposition": return "Prép.";
    case "color": return "Couleur";
    default: return type;
  }
}

export default function VocabularyCard({ word, hideArabic, hideFrench, index }: VocabularyCardProps) {
  const [revealed, setRevealed] = useState(false);

  const isHidden = hideArabic || hideFrench;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Card className="transition-all duration-200" data-testid={`vocab-card-${word.id}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-medium ${getTypeColor(word.type)}`}>
              {getTypeLabel(word.type)}
            </span>
            {isHidden && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setRevealed(!revealed)}
                aria-label={revealed ? "Cacher le mot" : "Révéler le mot"}
                data-testid={`button-reveal-${word.id}`}
              >
                {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </Button>
            )}
          </div>

          <div className="mt-3 space-y-2">
            <div className="min-h-[28px]">
              {hideFrench && !revealed ? (
                <div
                  className="h-6 w-3/4 rounded-md bg-muted/80 cursor-pointer"
                  onClick={() => setRevealed(true)}
                  role="button"
                  aria-label="Révéler la traduction française"
                  data-testid={`hidden-french-${word.id}`}
                />
              ) : (
                <p className="text-sm font-medium text-foreground" data-testid={`text-french-${word.id}`}>
                  {word.french}
                </p>
              )}
            </div>

            <div className="min-h-[40px]">
              {hideArabic && !revealed ? (
                <div
                  className="h-8 w-2/3 rounded-md bg-muted/80 cursor-pointer ml-auto"
                  onClick={() => setRevealed(true)}
                  role="button"
                  aria-label="Révéler le mot arabe"
                  data-testid={`hidden-arabic-${word.id}`}
                />
              ) : (
                <div className="text-right" dir="rtl">
                  <p className="font-arabic text-2xl leading-relaxed text-foreground" data-testid={`text-arabic-${word.id}`}>
                    {word.arabic}
                  </p>
                  {word.arabicPlural && (
                    <p className="font-arabic text-lg text-muted-foreground mt-0.5" data-testid={`text-arabic-plural-${word.id}`}>
                      ج: {word.arabicPlural}
                    </p>
                  )}
                  {word.vowelHint && (
                    <p className="font-arabic text-sm text-muted-foreground/70 mt-0.5">
                      المضارع: {word.vowelHint}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
