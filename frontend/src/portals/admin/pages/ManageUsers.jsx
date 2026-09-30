import React, { useEffect, useState } from 'react';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

async function getAllUsers() {
  const snapshot = await getDocs(collection(db, 'users'));

  return snapshot.docs.map((userDocument) => {
    const data = userDocument.data();
    const createdAt = data.createdAt?.toDate
      ? data.createdAt.toDate()
      : new Date(data.createdAt);

    return {
      documentId: userDocument.id,
      id: String(data.registration_ID ?? data.UID ?? userDocument.id),
      name: data.Name ?? data.name ?? 'Unknown user',
      email: data.Email ?? data.email ?? '',
      target: data.target ?? data.Target ?? '—',
      status: data.status ?? 'Active',
      joined: data.createdAt && !Number.isNaN(createdAt.getTime())
        ? createdAt.toLocaleDateString()
        : '—',
    };
  });
}

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    let isMounted = true;

    getAllUsers()
      .then((fetchedUsers) => {
        if (isMounted) setUsers(fetchedUsers);
      })
      .catch(() => {
        if (isMounted) setLoadError('Unable to load users. Please check your connection and Firestore permissions.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter students based on search input
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q) ||
      u.target.toLowerCase().includes(q)
    );
  });

  const toggleUserStatus = async (id) => {
    const user = users.find((currentUser) => currentUser.documentId === id);
    if (!user) return;

    const nextStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    setUpdatingUserId(id);
    setActionError('');

    try {
      await updateDoc(doc(db, 'users', id), { status: nextStatus });
      setUsers((previousUsers) => previousUsers.map((currentUser) => (
        currentUser.documentId === id
          ? { ...currentUser, status: nextStatus }
          : currentUser
      )));
    } catch {
      setActionError(`Unable to ${nextStatus === 'Suspended' ? 'suspend' : 'activate'} ${user.name}. Please try again.`);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const activeCount = users.filter((u) => u.status === 'Active').length;
  const suspendedCount = users.filter((u) => u.status === 'Suspended').length;

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      {/* Header Panel */}
      <div className="border-b border-slate-800 pb-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <span className="text-amber-500">🧑‍🎓</span>
            <span>User Accounts Control Roster</span>
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Review registered profiles, audit performance tracking logs, and apply security suspension configurations.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="w-full md:w-72 relative">
          <span className="absolute left-3.5 top-3 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
            placeholder="Search name, email, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Total Registered</div>
            <div className="text-2xl font-bold text-white mt-1">{users.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg">
            👥
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-400 uppercase font-semibold">Active Profiles</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{activeCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg">
            ✓
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-rose-400 uppercase font-semibold">Suspended Nodes</div>
            <div className="text-2xl font-bold text-rose-400 mt-1">{suspendedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-lg">
            ⊘
          </div>
        </div>
      </div>

      {actionError && (
        <p className="mb-4 text-sm text-rose-400" role="alert">{actionError}</p>
      )}

      {/* Roster Table Frame */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800 font-semibold">
            <tr>
              <th className="px-5 py-4">User ID</th>
              <th className="px-5 py-4">Student Details</th>
              <th className="px-5 py-4">Target Matrix</th>
              <th className="px-5 py-4">Onboard Date</th>
              <th className="px-5 py-4">Status Layer</th>
              <th className="px-5 py-4 text-center">Action Console</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-normal">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-slate-400" role="status">
                  Loading users...
                </td>
              </tr>
            ) : loadError ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-rose-400" role="alert">
                  {loadError}
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-slate-400">
                  {searchQuery ? `No users found matching "${searchQuery}"` : 'No users found'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const isActive = user.status === 'Active';
                return (
                  <tr key={user.documentId} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-amber-400">
                      {user.id}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{user.name}</div>
                      <div className="text-xs text-slate-400">{user.email}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">
                        {user.target}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {user.joined}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${isActive
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => alert(`Accessing performance audit logs for ${user.name} (${user.id})`)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
                        >
                          View Logs
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleUserStatus(user.documentId)}
                          disabled={updatingUserId === user.documentId}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${isActive
                              ? 'text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/25'
                              : 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/25'
                            }`}
                        >
                          {updatingUserId === user.documentId ? 'Saving...' : isActive ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
