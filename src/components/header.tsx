import { Wallet } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center">
      <div className="p-2 bg-primary/20 rounded-lg">
        <Wallet className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-3xl font-bold ml-4 font-headline tracking-tight">
        Chai Wallet
      </h1>
    </header>
  );
}
