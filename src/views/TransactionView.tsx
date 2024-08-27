import React, { useEffect, useState, useContext } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

type StatusColors = {
  SUCCESS: string;
  COMPLETED: string;
  FAILED: string;
  DISPUTE: string;
  [key: string]: string;
};

const statusColors: StatusColors = {
  PENDING: 'orange',
  IN_PROGRESS: 'blue',
  SUCCESS: 'green',
  COMPLETED: 'darkgreen',
  FAILED: 'red',
  DISPUTE: 'purple',
};

const getStatusColor = (status: string): string => statusColors[status] || 'black';

interface Transaction {
  currency: string;
  status: string;
  _id: string;
  type: string;
  amount: number;
  fromWallet: string;
  toWallet: string;
  stripePaymentIntentId: string | null;
  createdAt: string;
  __v: number;
};

type Account = {
  bankAccountId: string;
};


const TransactionsView: React.FC = () => {
  const authContext = useContext(AuthContext);
  const userId = authContext?.authState?.userId;
  const token = authContext?.authState?.token;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const transactionsPerPage = 10;
  const isFirst = true;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
          const transactionsResponse = await axios.get<Transaction[]>(`http://localhost:3000/api/wallet/transactions`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

        let localTotalPages = 0;
        let allTransactions: Transaction[] = [];

        //localTotalPages = Math.ceil(transactionsResponse.data.size / transactionsPerPage);
        allTransactions = transactionsResponse.data;

        setTransactions(allTransactions);
        setTotalPages(localTotalPages);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, [userId, token, currentPage, transactionsPerPage]);

  function handlePageChange(arg0: number): void {
    throw new Error('Function not implemented.');
  }

    return (
    <div className="space-y-6">
      <div className="flex items-center bg-white shadow rounded-lg p-2">
        <Search className="text-gray-400 mr-2" size={20} />
        <input
          type="text"
          placeholder="Search transactions..."
          className="flex-grow outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.createdAt}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(transaction.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionsView;