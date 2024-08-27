import React, { useState, useContext } from 'react';
import { CreditCard, QrCode, X } from 'lucide-react';
import { wait } from '@testing-library/user-event/dist/utils';
import axios from 'axios';
import { AuthContext } from 'contexts/AuthContext';

interface Store {
  id: number;
  name: string;
  distance: string;
}

interface Item {
  id: number;
  name: string;
  price: number;
}

type QrCodes = {
  [key: string]: Store | Item;
};

const StorePurchase: React.FC = () => {
  const [total, setTotal] = useState<number>(0);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const userId = authContext?.authState?.userId || '';
  const token = authContext?.authState?.token;


  const startScanning = async () => {
    // get the amount (cast into number)
    const amount = document.getElementById('paying-amount') as HTMLInputElement;
    let amountValue = amount ? parseFloat(amount.value) : 0;

    if (!amountValue) {
      console.error('Amount input not found');
      return;
    }
    if(amountValue <= 0) {
      console.error('Amount input is invalid');
      return;
    }

    try {
      // use axios
      const response = await axios.post('http://localhost:3000/api/wallet/generate-qr', {
        amount: amountValue
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
      const data = response.data;
      setQrCodeDataURL(data.qrCodeDataURL);
    } catch (error) {
      console.error('Error fetching QR code:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Select Amount to be Payed</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Amount</div>
            <input
              type="number"
              className="w-1/2 border border-gray-300 rounded-md p-2"
              id="paying-amount"
            />
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <button
            onClick={() => startScanning()}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <QrCode size={18} className="mr-2" />
            Generate QR Code
          </button>
        </div>
      </div>
      {qrCodeDataURL && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">QR Code</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <img src={qrCodeDataURL} alt="QR Code" />
          </div>
        </div>
      )}
    </div>
  );

};

export default StorePurchase;