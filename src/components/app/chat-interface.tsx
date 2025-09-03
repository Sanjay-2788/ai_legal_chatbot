'use client';

import type { Topic } from './topic-selection';
import { useEffect, useRef, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getAIResponse } from '@/app/actions';
import { ArrowLeft, Scale, Send, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const AiAvatar = () => (
  <Avatar className="h-9 w-9">
    <AvatarFallback className="bg-primary text-primary-foreground">
      <Scale className="h-5 w-5" />
    </AvatarFallback>
  </Avatar>
);

const UserAvatar = () => (
  <Avatar className="h-9 w-9">
    <AvatarFallback className="bg-accent text-accent-foreground">
      <User className="h-5 w-5" />
    </AvatarFallback>
  </Avatar>
);

type ChatMessage = {
  role: 'user' | 'ai' | 'system';
  content: React.ReactNode;
};

type ChatProps = {
  topic: Topic;
  language: 'en' | 'ta';
  onBack: () => void;
};

const formSchema = z.object({
  question: z.string().min(1, 'Please enter a question.'),
});
type FormValues = z.infer<typeof formSchema>;

export function ChatInterface({ topic, language, onBack }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const systemMessage = (
      <div className="space-y-2">
        <p>{topic.greeting}</p>
        <p className="font-semibold">For example, you can ask:</p>
        <ul className="list-disc list-inside space-y-1">
          {topic.examples.map((ex, i) => (
            <li key={i}>{ex}</li>
          ))}
        </ul>
      </div>
    );
    setMessages([{ role: 'system', content: systemMessage }]);
  }, [topic, language]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const userMessage: ChatMessage = { role: 'user', content: data.question };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    reset();

    const result = await getAIResponse({
      topic: topic.name,
      question: data.question,
      language: language,
    });
    
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      setMessages((prev) =>
        prev.filter((msg) => msg.content !== data.question)
      );
    } else {
      const aiMessage: ChatMessage = { role: 'ai', content: result.answer };
      setMessages((prev) => [...prev, aiMessage]);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto bg-card rounded-lg shadow-lg border">
      <header className="flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-headline font-semibold">{topic.name}</h2>
      </header>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3',
                message.role === 'user' && 'justify-end'
              )}
            >
              {message.role !== 'user' && <AiAvatar />}
              <div
                className={cn(
                  'rounded-lg px-4 py-3 max-w-[85%] text-sm',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted',
                  message.role === 'system' &&
                    'bg-background border-2 border-dashed border-primary/50 text-foreground w-full max-w-full'
                )}
              >
                {message.content}
              </div>
              {message.role === 'user' && <UserAvatar />}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <AiAvatar />
              <div className="rounded-lg px-4 py-3 bg-muted w-full max-w-[85%]">
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-background rounded-b-lg">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-start gap-3"
        >
          <Textarea
            {...register('question')}
            placeholder={
              isLoading ? 'Generating response...' : 'Ask a question...'
            }
            className="flex-1 resize-none"
            rows={1}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading}
            className="h-auto aspect-square"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        {errors.question && (
          <p className="text-destructive text-xs mt-1">
            {errors.question.message}
          </p>
        )}
      </div>
    </div>
  );
}
