import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { VocabWord } from "@/data/vocabulary";

interface StudyModeProps {
  words: VocabWord[];
  onExit: () => void;
}

export default function StudyMode({ words, onExit }: StudyModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [knownIds, setKnownIds] = useState<Set<string>>(new Set());
  const [direction, setDirection] = useState<"arabic" | "french">("arabic");

  const orderedWords = useMemo(() => {
    if (!shuffled) return words;
    return [...words].sort(() => Math.random() - 0.5);
  }, [words, shuffled]);

  const currentWord = orderedWords[currentIndex];
  const progress = ((currentIndex + 1) / orderedWords.length) * 100;

  const next = useCallback(() => {
    if (currentIndex < orderedWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setRevealed(false);
    }
  }, [currentIndex, orderedWords.length]);

  const prev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setRevealed(false);
    }
  }, [currentIndex]);

  const markKnown = useCallback(() => {
    setKnownIds(prev => new Set(prev).add(currentWord.id));
    next();
  }, [currentWord, next]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setRevealed(false);
    setKnownIds(new Set());
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffled(prev => !prev);
    setCurrentIndex(0);
    setRevealed(false);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={toggleShuffle} data-testid="button-shuffle">
              <Shuffle className="h-3.5 w-3.5 mr-1.5" />
              {shuffled ? "Ordonné" : "Mélanger"}
            </Button>
            <Button size="sm" variant="secondary" onClick={reset} data-testid="button-reset">
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Réinitialiser
            </Button>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant={direction === "arabic" ? "default" : "secondary"}
              onClick={() => { setDirection("arabic"); setRevealed(false); }}
              data-testid="button-dir-arabic"
            >
              عربي
            </Button>
            <Button
              size="sm"
              variant={direction === "french" ? "default" : "secondary"}
              onClick={() => { setDirection("french"); setRevealed(false); }}
              data-testid="button-dir-french"
            >
              FR
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{currentIndex + 1} / {orderedWords.length}</span>
            <span data-testid="text-known-count">{knownIds.size} connu(s)</span>
          </div>
          <Progress value={progress} className="h-1.5" data-testid="progress-study" />
        </div>

        <motion.div
          key={currentWord.id + direction}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="cursor-pointer"
          onClick={() => setRevealed(true)}
          data-testid="flashcard"
        >
          <Card className="min-h-[220px] relative">
            <CardContent className="p-8 flex flex-col items-center justify-center min-h-[220px]">
              {knownIds.has(currentWord.id) && (
                <div className="absolute top-3 right-3">
                  <Check className="h-4 w-4 text-primary" />
                </div>
              )}
              <div className="text-center space-y-6 w-full">
                {direction === "arabic" ? (
                  <>
                    <div dir="rtl">
                      <p className="font-arabic text-3xl leading-relaxed text-foreground" data-testid="text-flashcard-question">
                        {currentWord.arabic}
                      </p>
                      {currentWord.arabicPlural && (
                        <p className="font-arabic text-xl text-muted-foreground mt-1">
                          ج: {currentWord.arabicPlural}
                        </p>
                      )}
                    </div>
                    <AnimatePresence>
                      {revealed ? (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border-t border-border/30 pt-4"
                        >
                          <p className="text-lg text-foreground font-medium" data-testid="text-flashcard-answer">
                            {currentWord.french}
                          </p>
                        </motion.div>
                      ) : (
                        <p className="text-xs text-muted-foreground">Cliquer pour révéler</p>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <>
                    <p className="text-lg text-foreground font-medium" data-testid="text-flashcard-question">
                      {currentWord.french}
                    </p>
                    <AnimatePresence>
                      {revealed ? (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border-t border-border/30 pt-4"
                          dir="rtl"
                        >
                          <p className="font-arabic text-3xl leading-relaxed text-foreground" data-testid="text-flashcard-answer">
                            {currentWord.arabic}
                          </p>
                          {currentWord.arabicPlural && (
                            <p className="font-arabic text-xl text-muted-foreground mt-1">
                              ج: {currentWord.arabicPlural}
                            </p>
                          )}
                        </motion.div>
                      ) : (
                        <p className="text-xs text-muted-foreground">Cliquer pour révéler</p>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex items-center justify-between gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={prev}
            disabled={currentIndex === 0}
            data-testid="button-prev"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Précédent
          </Button>

          {revealed && (
            <Button
              size="sm"
              variant="default"
              onClick={markKnown}
              data-testid="button-mark-known"
            >
              <Check className="h-3.5 w-3.5 mr-1.5" />
              Connu
            </Button>
          )}

          <Button
            size="sm"
            variant="secondary"
            onClick={next}
            disabled={currentIndex === orderedWords.length - 1}
            data-testid="button-next"
          >
            Suivant
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {currentIndex === orderedWords.length - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-4 rounded-md bg-primary/5 border border-primary/10"
          >
            <p className="text-sm font-medium text-foreground">
              Terminé ! Vous avez mémorisé {knownIds.size} / {orderedWords.length} mot(s).
            </p>
            <Button size="sm" variant="default" className="mt-3" onClick={reset} data-testid="button-restart-study">
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Recommencer
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
