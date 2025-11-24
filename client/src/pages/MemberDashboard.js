import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LogOut, DollarSign, PlusCircle } from 'lucide-react';

const MemberDashboard = () => {
  const { user, logout } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loanForm, setLoanForm] = useState({ amount: '', purpose: '', duration_months: 12 });
  const [showLoanForm, setShowLoanForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('/loans/my');
      setLoans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/loans', loanForm);
      setShowLoanForm(false);
      setLoanForm({ amount: '', purpose: '', duration_months: 12 });
      fetchData();
    } catch (err) {
      alert('Error applying for loan');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center text-xl font-bold">CICS Member Portal</div>
            <div className="flex items-center space-x-4">
              <span>{user.full_name}</span>
              <button onClick={logout} className="p-2 hover:bg-green-700 rounded-full">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-bold">Savings Balance</h3>
            <p className="text-3xl font-bold text-gray-800">${user.account_balance || '0.00'}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-bold">Monthly Contribution</h3>
            <p className="text-3xl font-bold text-gray-800">${user.monthly_savings || '0.00'}</p>
          </div>
        </div>

        {/* Loan Section */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">My Loans</h2>
            <button
              onClick={() => setShowLoanForm(!showLoanForm)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <PlusCircle size={16} className="mr-2" /> Apply for Loan
            </button>
          </div>

          {showLoanForm && (
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <form onSubmit={handleLoanSubmit} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    value={loanForm.amount}
                    onChange={e => setLoanForm({...loanForm, amount: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Purpose</label>
                  <textarea
                    value={loanForm.purpose}
                    onChange={e => setLoanForm({...loanForm, purpose: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Submit Application</button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loans.map(loan => (
                  <tr key={loan.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(loan.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${loan.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loan.purpose}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${loan.status === 'approved' ? 'bg-green-100 text-green-800' :
                          loan.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {loan.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {loans.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No loan history found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
