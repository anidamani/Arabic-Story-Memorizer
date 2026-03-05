import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { BookOpen, Eye, EyeOff, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { VocabSet, VocabWord } from "@/data/vocabulary";

interface StoryViewProps {
  vocabSet: VocabSet;
}

function stripDiacritics(text: string): string {
  return text.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "");
}

function stripPrefixes(word: string): string {
  const prefixes = ["ال", "وال", "فال", "بال", "لل", "كال", "و", "ف", "ب", "ل", "ك"];
  for (const prefix of prefixes) {
    if (word.startsWith(prefix) && word.length > prefix.length + 1) {
      return word.slice(prefix.length);
    }
  }
  return word;
}

interface StorySegment {
  text: string;
  isVocab: boolean;
  matchedWord?: VocabWord;
}

function parseStoryWithVocab(story: string, words: VocabWord[]): StorySegment[] {
  const vocabRoots = words.flatMap(w => {
    const roots: { stripped: string; word: VocabWord }[] = [];
    const mainStripped = stripDiacritics(w.arabic).replace(/\s.+$/, "");
    roots.push({ stripped: mainStripped, word: w });
    const withoutPrefix = stripPrefixes(mainStripped);
    if (withoutPrefix !== mainStripped) {
      roots.push({ stripped: withoutPrefix, word: w });
    }
    if (w.arabicPlural) {
      const pluralStripped = stripDiacritics(w.arabicPlural);
      roots.push({ stripped: pluralStripped, word: w });
      const pluralNoPrefix = stripPrefixes(pluralStripped);
      if (pluralNoPrefix !== pluralStripped) {
        roots.push({ stripped: pluralNoPrefix, word: w });
      }
    }
    return roots;
  });

  vocabRoots.sort((a, b) => b.stripped.length - a.stripped.length);

  const tokens = story.split(/(\s+)/);
  const segments: StorySegment[] = [];

  for (const token of tokens) {
    if (/^\s+$/.test(token)) {
      segments.push({ text: token, isVocab: false });
      continue;
    }

    const strippedToken = stripDiacritics(token);
    const tokenCore = stripPrefixes(strippedToken);

    let matched = false;
    for (const { stripped, word } of vocabRoots) {
      if (stripped.length < 2) continue;
      if (tokenCore === stripped || strippedToken === stripped || tokenCore.startsWith(stripped) || strippedToken.startsWith(stripped)) {
        segments.push({ text: token, isVocab: true, matchedWord: word });
        matched = true;
        break;
      }
    }

    if (!matched) {
      segments.push({ text: token, isVocab: false });
    }
  }

  return segments;
}

export default function StoryView({ vocabSet }: StoryViewProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [hideVocab, setHideVocab] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const segments = useMemo(
    () => parseStoryWithVocab(vocabSet.story, vocabSet.words),
    [vocabSet.story, vocabSet.words]
  );

  const toggleReveal = useCallback((wordId: string) => {
    setRevealedIds(prev => {
      const next = new Set(prev);
      if (next.has(wordId)) {
        next.delete(wordId);
      } else {
        next.add(wordId);
      }
      return next;
    });
  }, []);

  const handleToggleHide = useCallback(() => {
    setHideVocab(prev => !prev);
    setRevealedIds(new Set());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card data-testid="story-container">
        <CardHeader className="flex flex-row items-center justify-between gap-2 p-4 border-b border-border/30 space-y-0">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              القصة - L'histoire
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant={hideVocab ? "default" : "secondary"}
              onClick={handleToggleHide}
              aria-label={hideVocab ? "Révéler les mots" : "Cacher les mots"}
              data-testid="button-toggle-story"
            >
              {hideVocab ? <Eye className="h-3.5 w-3.5 mr-1.5" /> : <EyeOff className="h-3.5 w-3.5 mr-1.5" />}
              {hideVocab ? "Révéler" : "Cacher"}
            </Button>
            <Button
              size="sm"
              variant={showTranslation ? "default" : "secondary"}
              onClick={() => setShowTranslation(!showTranslation)}
              aria-label={showTranslation ? "Cacher la traduction" : "Afficher la traduction"}
              data-testid="button-toggle-translation"
            >
              <Languages className="h-3.5 w-3.5 mr-1.5" />
              Traduction
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          <div dir="rtl" className="text-right">
            <p
              className="font-arabic text-xl leading-[2.2] text-foreground"
              data-testid="text-story-arabic"
            >
              {segments.map((seg, i) => {
                if (!seg.isVocab || !seg.matchedWord) {
                  return <span key={i}>{seg.text}</span>;
                }

                const wordId = seg.matchedWord.id;
                const isHidden = hideVocab && !revealedIds.has(wordId);

                if (isHidden) {
                  return (
                    <span
                      key={i}
                      className="inline-block bg-primary/20 dark:bg-primary/30 rounded px-1 mx-0.5 cursor-pointer min-w-[2.5em] text-center align-baseline select-none transition-colors duration-200 hover:bg-primary/30 dark:hover:bg-primary/40"
                      onClick={() => toggleReveal(wordId)}
                      role="button"
                      aria-label={`Révéler: ${seg.matchedWord.french}`}
                      data-testid={`hidden-vocab-${wordId}`}
                    >
                      <span className="invisible">{seg.text}</span>
                    </span>
                  );
                }

                return (
                  <span
                    key={i}
                    className={`inline rounded px-0.5 transition-colors duration-200 ${
                      hideVocab && revealedIds.has(wordId)
                        ? "bg-primary/15 dark:bg-primary/25 cursor-pointer"
                        : "bg-primary/10 dark:bg-primary/20 text-foreground"
                    }`}
                    onClick={hideVocab ? () => toggleReveal(wordId) : undefined}
                    title={seg.matchedWord.french}
                    data-testid={`vocab-highlight-${wordId}`}
                  >
                    {seg.text}
                  </span>
                );
              })}
            </p>
          </div>

          {!hideVocab && (
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/20">
              {vocabSet.words.map(w => {
                const isInStory = segments.some(s => s.matchedWord?.id === w.id);
                if (!isInStory) return null;
                return (
                  <span
                    key={w.id}
                    className="inline-flex items-center gap-1 rounded-md bg-primary/10 dark:bg-primary/20 px-2 py-0.5 text-[11px]"
                    data-testid={`vocab-legend-${w.id}`}
                  >
                    <span className="font-arabic text-sm">{w.arabic}</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="text-muted-foreground">{w.french}</span>
                  </span>
                );
              })}
            </div>
          )}

          {showTranslation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="border-t border-border/30 pt-4 mt-2">
                <p className="text-sm leading-relaxed text-muted-foreground" data-testid="text-story-translation">
                  {vocabSet.storyTranslation}
                </p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
