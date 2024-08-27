import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

interface FormData {
  toUserId: string;
  amount: string;
}

interface BankAccount {
  bankAccountId: string;
  customerId: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  card: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  isDefault: boolean;
}

const CreateTransactionView: React.FC = () => {
  const authContext = useContext(AuthContext);
  const userId = authContext?.authState?.userId || '';
  const token = authContext?.authState?.token;
  const [formData, setFormData] = useState<FormData>({
    toUserId: userId,
    amount: '',
  });
  const [transactionType, setTransactionType] = useState<string>('deposit');
  const [paymentMethod, setPaymentMethod] = useState<string>('pm_card_visa');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/wallet/payment-methods', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPaymentMethods(response.data);
      } catch (error) {
        console.error('Error fetching payment methods', error);
      }
    };

    fetchPaymentMethods();
  }, [token]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const headers = {
      Authorization: `Bearer ${token}`
    };

    let url = "http://localhost:3000/api/wallet/transfer"

    setTransactionType(transactionType.toLowerCase())
    let data = {};

    if (transactionType === 'deposit') {
      url = "http://localhost:3000/api/wallet/deposit"
      console.log('deposit')
      data = {
        amount: formData.amount,
        paymentMethodId: paymentMethod,
      };
    } else if (transactionType === 'withdraw') {
      // Set it to somewhere else for now
      formData.toUserId = "66c2b6c49df3d1635b757300"
      console.log('withdraw')
      data = {
        toUserId: formData.toUserId,
        amount: formData.amount,
      };
    } else {
      data = {
        toUserId: formData.toUserId,
        amount: formData.amount,
      };
    }
    console.log(data);


    try {
      await axios.post(url, data, { headers });
      alert('Transaction successful');
    } catch (error) {
      console.error('Error creating transaction', error);
      alert('Transaction failed');
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
          <select
            name="transactionType"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="deposit">Deposit</option>
            <option value="withdraw">Withdraw</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">From Bank Account ID</label>
          <input type="text"
            id="bankAccountId"
            name="bankAccountId"
            value={formData.toUserId}
            onChange={handleChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={transactionType === 'deposit' || transactionType === 'withdraw'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
        {transactionType === 'deposit' && (
          <div>
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {paymentMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {`${method.card.brand.charAt(0).toUpperCase() + method.card.brand.slice(1)} - ${method.id}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateTransactionView;