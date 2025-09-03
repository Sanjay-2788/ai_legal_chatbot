'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type LanguageSwitcherProps = {
  language: 'en' | 'ta';
  setLanguage: (language: 'en' | 'ta') => void;
};

export function LanguageSwitcher({
  language,
  setLanguage,
}: LanguageSwitcherProps) {
  const handleLanguageChange = (checked: boolean) => {
    setLanguage(checked ? 'ta' : 'en');
  };

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="language-switch" className="font-bold">
        EN
      </Label>
      <Switch
        id="language-switch"
        checked={language === 'ta'}
        onCheckedChange={handleLanguageChange}
        aria-label="Language Switcher"
      />
      <Label htmlFor="language-switch" className="font-bold">
        TA
      </Label>
    </div>
  );
}
