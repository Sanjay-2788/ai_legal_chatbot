'use client';

import type { ReactNode } from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Scale,
  FileText,
  ShoppingCart,
  Laptop,
  Bike,
  Briefcase,
} from 'lucide-react';

export type Topic = {
  name: string;
  description: string;
  icon: ReactNode;
  greeting: string;
  examples: string[];
};

const topics: Topic[] = [
  {
    name: 'Fundamental Rights & Duties',
    description: 'Understand your constitutional rights and obligations.',
    icon: <Scale className="w-8 h-8 text-primary" />,
    greeting:
      'I can help with questions about Fundamental Rights and Duties as per the Indian Constitution.',
    examples: [
      'What is the right to equality?',
      'Can I practice any religion I want?',
      'What are my duties as a citizen?',
    ],
  },
  {
    name: 'Right to Information (RTI)',
    description: 'Learn to request information from public authorities.',
    icon: <FileText className="w-8 h-8 text-primary" />,
    greeting:
      'Ask me about the Right to Information (RTI) Act and how to use it.',
    examples: [
      'How do I file an RTI?',
      'What information can I ask for?',
      'How much does it cost to file an RTI?',
    ],
  },
  {
    name: 'Consumer Protection',
    description: 'Know your rights as a consumer against faulty products.',
    icon: <ShoppingCart className="w-8 h-8 text-primary" />,
    greeting:
      'Tell me your consumer-related issues. I can guide you on your rights.',
    examples: [
      'What if I get a fake product from online site?',
      'How to file a consumer complaint?',
      'What are my rights if a product is defective?',
    ],
  },
  {
    name: 'Basic Cyber Laws',
    description: 'Basic awareness about cybercrimes and online safety.',
    icon: <Laptop className="w-8 h-8 text-primary" />,
    greeting:
      'I can answer basic questions about cyber laws and online safety based on the IT Act.',
    examples: [
      'Is online harassment a crime?',
      'What to do if my social media account is hacked?',
      'What is phishing?',
    ],
  },
  {
    name: 'Road Safety Rules',
    description: 'Essential traffic rules under the Motor Vehicles Act.',
    icon: <Bike className="w-8 h-8 text-primary" />,
    greeting: 'Ask me about road safety and traffic rules in India.',
    examples: [
      'Can I ride bike without helmet?',
      'What is the fine for jumping a red light?',
      'Is it compulsory to have insurance for my vehicle?',
    ],
  },
  {
    name: 'Basic Labor Laws',
    description: 'Information on workplace rights and basic labor laws.',
    icon: <Briefcase className="w-8 h-8 text-primary" />,
    greeting: 'I can help you with basic questions about your rights at work.',
    examples: [
      'What are the standard working hours?',
      'Am I eligible for minimum wage?',
      'What to do in case of unsafe working conditions?',
    ],
  },
];

type TopicSelectionProps = {
  onSelectTopic: (topic: Topic) => void;
};

export function TopicSelection({ onSelectTopic }: TopicSelectionProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold font-headline tracking-tight">
          How can I help you today?
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Select a legal topic to get started.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {topics.map((topic) => (
          <Card
            key={topic.name}
            onClick={() => onSelectTopic(topic)}
            className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <CardHeader className="flex flex-col items-center text-center">
              {topic.icon}
              <CardTitle className="mt-4 font-headline">{topic.name}</CardTitle>
              <CardDescription className="mt-1">
                {topic.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
