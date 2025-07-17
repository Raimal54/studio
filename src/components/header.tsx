import { Wallet, LogOut, Download, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ThemeToggle } from './theme-toggle';
import { Account, Transaction } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface HeaderProps {
    accounts: Account[];
    activeAccount: string;
    setActiveAccount: (accountId: string) => void;
}

const exportToCSV = (transactions: Transaction[]) => {
    const headers = ['id', 'type', 'amount', 'category', 'date', 'accountId'];
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...transactions.map(t => headers.map(h => t[h as keyof Transaction]).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `chai-wallet-transactions-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


export function Header({ accounts, activeAccount, setActiveAccount }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  }

  const handleExport = () => {
    const allTransactions = JSON.parse(localStorage.getItem('chai-wallet-transactions') || '[]');
    exportToCSV(allTransactions);
  }

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-primary/20 rounded-lg">
            <Wallet className="w-8 h-8 text-primary" />
        </div>
        <div>
            <h1 className="text-xl sm:text-3xl font-bold font-headline tracking-tight">
                Chai Wallet
            </h1>
            <Select onValueChange={setActiveAccount} value={activeAccount}>
                <SelectTrigger className="w-[180px] h-8 mt-1 text-xs">
                    <SelectValue placeholder="Select Account" />
                </SelectTrigger>
                <SelectContent>
                    {accounts.map(acc => (
                        <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <ThemeToggle />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleExport}>
                    <Download className='mr-2 h-4 w-4' />
                    Export to CSV
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout}>
                    <LogOut className='mr-2 h-4 w-4' />
                    Log Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
