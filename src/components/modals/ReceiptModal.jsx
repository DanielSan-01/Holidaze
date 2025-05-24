import BaseModal from './BaseModal.jsx';

export default function ReceiptModal({ booking, profileName, isOpen, onClose }) {
  if (!isOpen || !booking) return null;

  const checkInDate = new Date(booking.dateFrom);
  const checkOutDate = new Date(booking.dateTo);
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  const totalCost = booking.venue.price * nights;
  
  // Generate fake but realistic receipt data
  const receiptNumber = `HOL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const purchaseDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
  const confirmationCode = `${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  
  // Fake customer details
  const customerDetails = {
    name: profileName || "Customer",
    email: profileName ? `${profileName}@stud.noroff.no` : "customer@stud.noroff.no",
    phone: "+47 123 45 678",
    address: "123 Student Street",
    city: "Bergen",
    postalCode: "5020",
    country: "Norway"
  };

  const taxes = Math.round(totalCost * 0.25);
  const subtotal = totalCost - taxes;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" className="relative">
      {/* Disclaimer Banner */}
      <div className="bg-yellow-100 border-b border-yellow-200 p-3 rounded-t-lg">
        <p className="text-xs text-yellow-800 text-center font-medium">
          This is not a real website! If it was, your purchase information would be here.
        </p>
      </div>

      <div className="p-6 font-mono text-sm">
        {/* Receipt Header */}
        <div className="text-center mb-6 border-b border-gray-300 pb-4">
          <h2 className="text-lg font-bold">HOLIDAZE</h2>
          <p className="text-xs text-gray-600">Your Holiday Booking Service</p>
          <p className="text-xs text-gray-600">www.holidaze.com</p>
          <p className="text-xs text-gray-600">support@holidaze.com</p>
        </div>

        {/* Receipt Details */}
        <div className="mb-4 space-y-1">
          <div className="flex justify-between">
            <span>Receipt #:</span>
            <span className="font-bold">{receiptNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Purchase Date:</span>
            <span>{purchaseDate.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Confirmation:</span>
            <span className="font-bold">{confirmationCode}</span>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-4 border-t border-gray-300 pt-3">
          <h3 className="font-bold mb-2">CUSTOMER INFORMATION</h3>
          <div className="text-xs space-y-1">
            <p>{customerDetails.name}</p>
            <p>{customerDetails.email}</p>
            <p>{customerDetails.phone}</p>
            <p>{customerDetails.address}</p>
            <p>{customerDetails.city}, {customerDetails.postalCode}</p>
            <p>{customerDetails.country}</p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="mb-4 border-t border-gray-300 pt-3">
          <h3 className="font-bold mb-2">BOOKING DETAILS</h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Property:</span>
              <span className="text-right max-w-[60%]">{booking.venue.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Check-in:</span>
              <span>{checkInDate.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Check-out:</span>
              <span>{checkOutDate.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Guests:</span>
              <span>{booking.guests}</span>
            </div>
            <div className="flex justify-between">
              <span>Nights:</span>
              <span>{nights}</span>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="mb-4 border-t border-gray-300 pt-3">
          <h3 className="font-bold mb-2">COST BREAKDOWN</h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Room Rate ({nights} nights):</span>
              <span>NOK {subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (25%):</span>
              <span>NOK {taxes}</span>
            </div>
            <div className="flex justify-between border-t border-gray-300 pt-2 font-bold">
              <span>TOTAL PAID:</span>
              <span>NOK {totalCost}</span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="mb-4 border-t border-gray-300 pt-3">
          <h3 className="font-bold mb-2">PAYMENT METHOD</h3>
          <div className="text-xs space-y-1">
            <p>Visa ending in 4242</p>
            <p>Processed by Stripe</p>
            <p>Transaction ID: {Math.random().toString(36).substr(2, 16).toUpperCase()}</p>
          </div>
        </div>

        {/* Terms */}
        <div className="border-t border-gray-300 pt-3 text-xs text-gray-600">
          <h3 className="font-bold mb-2">TERMS & CONDITIONS</h3>
          <ul className="space-y-1 text-xs">
            <li>• Cancellation policy applies</li>
            <li>• Check-in: 15:00 | Check-out: 11:00</li>
            <li>• Property contact info sent separately</li>
            <li>• Questions? Contact support@holidaze.com</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-gray-300 text-center text-xs text-gray-500">
          <p>Thank you for choosing Holidaze!</p>
          <p>Have a wonderful stay!</p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <button 
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-sans text-sm"
          >
            Close
          </button>
          <button 
            onClick={() => window.print()}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-sans text-sm"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </BaseModal>
  );
} 