import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Layers, BookOpen, GraduationCap, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import VocabularyCard from "@/components/vocabulary-card";
import StoryView from "@/components/story-view";
import StudyMode from "@/components/study-mode";
import { vocabularySets, type VocabWord } from "@/data/vocabulary";

interface HomeProps {
  selectedSet: number;
}

export default function Home({ selectedSet }: HomeProps) {
  const [hideArabic, setHideArabic] = useState(false);
  const [hideFrench, setHideFrench] = useState(false);
  const [activeTab, setActiveTab] = useState("vocabulary");
  const [searchQuery, setSearchQuery] = useState("");

  const vocabSet = vocabularySets.find(s => s.id === selectedSet) || vocabularySets[0];

  const filteredWords = useMemo(() => {
    if (!searchQuery.trim()) return vocabSet.words;
    const q = searchQuery.toLowerCase();
    return vocabSet.words.filter(w =>
      w.french.toLowerCase().includes(q) ||
      w.arabic.includes(q) ||
      (w.arabicPlural && w.arabicPlural.includes(q))
    );
  }, [vocabSet.words, searchQuery]);

  const stats = useMemo(() => {
    const types: Record<string, number> = {};
    vocabSet.words.forEach(w => {
      types[w.type] = (types[w.type] || 0) + 1;
    });
    return types;
  }, [vocabSet]);

  return (
    <ScrollArea className="h-full">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <motion.div
          key={vocabSet.id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-[11px]">
                  Série {vocabSet.id} / {vocabularySets.length}
                </Badge>
                <Badge variant="outline" className="text-[11px]">
                  {vocabSet.words.length} mots
                </Badge>
              </div>
              <h1 className="text-xl font-semibold text-foreground" data-testid="text-set-title">
                {vocabSet.title}
              </h1>
              <p className="font-arabic text-lg text-muted-foreground mt-0.5" dir="rtl" data-testid="text-set-title-ar">
                {vocabSet.titleAr}
              </p>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList data-testid="tabs-main">
            <TabsTrigger value="vocabulary" data-testid="tab-vocabulary">
              <Layers className="h-3.5 w-3.5 mr-1.5" />
              Vocabulaire
            </TabsTrigger>
            <TabsTrigger value="story" data-testid="tab-story">
              <BookOpen className="h-3.5 w-3.5 mr-1.5" />
              Histoire
            </TabsTrigger>
            <TabsTrigger value="study" data-testid="tab-study">
              <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
              Étudier
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vocabulary" className="mt-4 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un mot..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-sm"
                  data-testid="input-search"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant={hideArabic ? "default" : "secondary"}
                  onClick={() => { setHideArabic(!hideArabic); setHideFrench(false); }}
                  data-testid="button-hide-arabic"
                >
                  {hideArabic ? <Eye className="h-3.5 w-3.5 mr-1.5" /> : <EyeOff className="h-3.5 w-3.5 mr-1.5" />}
                  Arabe
                </Button>
                <Button
                  size="sm"
                  variant={hideFrench ? "default" : "secondary"}
                  onClick={() => { setHideFrench(!hideFrench); setHideArabic(false); }}
                  data-testid="button-hide-french"
                >
                  {hideFrench ? <Eye className="h-3.5 w-3.5 mr-1.5" /> : <EyeOff className="h-3.5 w-3.5 mr-1.5" />}
                  Français
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredWords.map((word, i) => (
                <VocabularyCard
                  key={word.id}
                  word={word}
                  hideArabic={hideArabic}
                  hideFrench={hideFrench}
                  index={i}
                />
              ))}
            </div>

            {filteredWords.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">Aucun mot trouvé pour "{searchQuery}"</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="story" className="mt-4">
            <StoryView vocabSet={vocabSet} />
          </TabsContent>

          <TabsContent value="study" className="mt-4">
            <StudyMode words={vocabSet.words} onExit={() => setActiveTab("vocabulary")} />
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
