import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface Account {
  id: number;
  name: string;
  balance: number;
  number: string;
}

function AccountsView() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const handleAddAccount = () => {
    const name = prompt("Enter account name:");
    if (name) {
      const newAccount: Account = {
        id: accounts.length + 1,
        name,
        balance: 0,
        number: '0000-0000-0000-0000',
      };
      setAccounts([...accounts, newAccount]);
    }
  };

  return (
    <div className="space-y-6">
      {accounts.map((account) => (
        <div key={account.id} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">{account.name}</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900">${account.balance.toFixed(2)}</p>
            <p className="mt-1 text-sm text-gray-500">Account number: {account.number}</p>
          </div>
        </div>
      ))}
      <button
        onClick={handleAddAccount}
        className="flex items-center space-x-2 text-blue-500 hover:text-blue-700"
      >
        <PlusCircle className="w-5 h-5" />
        <span>Add Account</span>
      </button>
    </div>
  );
}

export default AccountsView;