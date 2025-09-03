'use client';

import { useState } from 'react';
import type { Topic } from '@/components/app/topic-selection';
import { TopicSelection } from '@/components/app/topic-selection';
import { ChatInterface } from '@/components/app/chat-interface';
import { LanguageSwitcher } from '@/components/app/language-switcher';
import { Scale } from 'lucide-react';

export default function Home() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [language, setLanguage] = useState<'en' | 'ta'>('en');

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Scale className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold font-headline text-primary">
              AI Legal Sakhi
            </h1>
          </div>
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
        </div>
      </header>
      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="container mx-auto flex-1 p-4 flex flex-col">
          {selectedTopic ? (
            <ChatInterface
              topic={selectedTopic}
              language={language}
              onBack={() => setSelectedTopic(null)}
            />
          ) : (
            <TopicSelection onSelectTopic={setSelectedTopic} />
          )}
        </div>
      </main>
      <footer className="py-4">
        <p className="text-center text-sm text-muted-foreground">
          Disclaimer: This is an AI assistant for informational purposes only.
          Please consult a licensed legal expert for professional advice.
        </p>
      </footer>
    </div>
  );
}
