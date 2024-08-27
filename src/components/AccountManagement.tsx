import React, { useState, useContext, useEffect} from 'react';
import { CreditCard, Trash2 } from 'lucide-react';
import { AuthContext } from 'contexts/AuthContext';

const allowedPaymentMethods = [
  { id: 'pm_card_visa', label: 'Visa' },
  { id: 'pm_card_visa_debit', label: 'Visa Debit' },
  { id: 'pm_card_mastercard', label: 'MasterCard' },
  { id: 'pm_card_mastercard_prepaid', label: 'MasterCard Prepaid' },
  { id: 'pm_card_amex', label: 'American Express' },
  { id: 'pm_ccard_discover', label: 'Discover' },
  { id: 'pm_card_diners', label: 'Diners Club' },
  { id: 'pm_card_jcb', label: 'JCB' },
  { id: 'pm_card_unionpay', label: 'UnionPay' }
];

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

const AccountManagement = () => {
  const [selectedCard, setSelectedCard] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCVV, setNewCardCVV] = useState('');
  const [error, setError] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const authContext = useContext(AuthContext);
  const authState = authContext?.authState;
  const userId = authState?.userId;
  const token = authState?.token;

  const handleAddPaymentMethod = (e: any) => {
    e.preventDefault();

    if (!selectedCard) {
      setError('Please select a payment method.');
      return;
    }

    // Proceed with adding the payment method
    setError('');
    // Add your logic to handle the valid payment method here
  };

  const handleDeletePaymentMethod = (id: string) => {
    // Proceed with deleting the payment method
    // Add your logic to delete the payment method here
  }

  const fetchPaymentMethods = () => {
    fetch(`http://localhost:3000/api/wallet/payment-methods`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setPaymentMethods(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  return (
    <div className="px-4 py-4 sm:px-6">
      <div>
        {
          paymentMethods.length > 0 ? (paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between py-2 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">{method.id}</p>
                <p className="text-sm text-gray-500">{method.card.brand} ending in {method.card.last4}</p>
              </div>
              <button className="text-red-500" onClick={() => handleDeletePaymentMethod(method.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))) : <p className="text-sm text-gray-500">No payment methods added yet.</p>
        }
      </div>
      <form onSubmit={handleAddPaymentMethod} className="space-y-2">
        <select
          value={selectedCard}
          onChange={(e) => setSelectedCard(e.target.value)}
          className="w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md"
        >
          <option value="" disabled>Select Payment Method</option>
          {allowedPaymentMethods.map((method) => (
            <option key={method.id} value={method.id}>{method.label}</option>
          ))}
        </select>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newCardExpiry}
            onChange={(e) => setNewCardExpiry(e.target.value)}
            placeholder="MM/YY"
            className="flex-grow shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md"
          />
          <input
            type="text"
            value={newCardCVV}
            onChange={(e) => setNewCardCVV(e.target.value)}
            placeholder="CVV"
            className="flex-grow shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <CreditCard size={18} className="mr-2" />
          Add Payment Method
        </button>
      </form>
    </div>
  );
};

export default AccountManagement;