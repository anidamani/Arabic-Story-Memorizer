import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Eye, EyeOff, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { VocabSet } from "@/data/vocabulary";

interface StoryViewProps {
  vocabSet: VocabSet;
}

export default function StoryView({ vocabSet }: StoryViewProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [hideStory, setHideStory] = useState(false);

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
              variant={hideStory ? "default" : "secondary"}
              onClick={() => setHideStory(!hideStory)}
              aria-label={hideStory ? "Révéler l'histoire" : "Cacher l'histoire"}
              data-testid="button-toggle-story"
            >
              {hideStory ? <Eye className="h-3.5 w-3.5 mr-1.5" /> : <EyeOff className="h-3.5 w-3.5 mr-1.5" />}
              {hideStory ? "Révéler" : "Cacher"}
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
          {hideStory ? (
            <div
              className="space-y-2 cursor-pointer"
              onClick={() => setHideStory(false)}
              role="button"
              aria-label="Cliquer pour révéler l'histoire"
              data-testid="hidden-story"
            >
              <div className="h-6 w-full rounded-md bg-muted/60" />
              <div className="h-6 w-5/6 rounded-md bg-muted/60" />
              <div className="h-6 w-4/6 rounded-md bg-muted/60" />
              <p className="text-center text-xs text-muted-foreground mt-3">
                Cliquer pour révéler l'histoire
              </p>
            </div>
          ) : (
            <div dir="rtl" className="text-right">
              <p
                className="font-arabic text-xl leading-[2.2] text-foreground"
                data-testid="text-story-arabic"
              >
                {vocabSet.story}
              </p>
            </div>
          )}

          {showTranslation && !hideStory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="border-t border-border/30 pt-4 mt-4">
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
