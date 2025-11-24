import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LogOut, Users, DollarSign, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [members, setMembers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const membersRes = await axios.get('/members');
      setMembers(membersRes.data);
      const loansRes = await axios.get('/loans');
      setLoans(loansRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateLoanStatus = async (id, status) => {
    try {
      await axios.put(`/loans/${id}/status`, { status });
      fetchData(); // Refresh data
    } catch (err) {
      console.error(err);
      alert('Error updating loan status');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-green-800 text-white">
        <div className="p-4 text-2xl font-bold">CICS Admin</div>
        <nav className="mt-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center w-full px-6 py-3 ${activeTab === 'overview' ? 'bg-green-900' : 'hover:bg-green-700'}`}
          >
            <DollarSign className="mr-3" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center w-full px-6 py-3 ${activeTab === 'members' ? 'bg-green-900' : 'hover:bg-green-700'}`}
          >
            <Users className="mr-3" /> Members
          </button>
          <button
            onClick={() => setActiveTab('loans')}
            className={`flex items-center w-full px-6 py-3 ${activeTab === 'loans' ? 'bg-green-900' : 'hover:bg-green-700'}`}
          >
            <FileText className="mr-3" /> Loans
          </button>
          <button
            onClick={logout}
            className="flex items-center w-full px-6 py-3 hover:bg-green-700 mt-auto"
          >
            <LogOut className="mr-3" /> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
          <div className="text-gray-600">Welcome, {user.full_name}</div>
        </header>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-bold">Total Members</h3>
              <p className="text-3xl font-bold text-green-600">{members.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-bold">Pending Loans</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {loans.filter(l => l.status === 'pending').length}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map(member => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{member.full_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${member.account_balance}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{member.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'loans' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loans.map(loan => (
                  <tr key={loan.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{loan.full_name || loan.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${loan.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${loan.status === 'approved' ? 'bg-green-100 text-green-800' :
                          loan.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {loan.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateLoanStatus(loan.id, 'approved')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateLoanStatus(loan.id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
