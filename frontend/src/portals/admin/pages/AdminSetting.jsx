import React, { useEffect, useState } from 'react';
import { deleteDoc, doc, getDoc, getDocs, collection, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase';

export default function AdminSetting() {
  // Master operation selection state: 'create' | 'update' | 'delete'
  const [settingAction, setSettingAction] = useState('create');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form input data state bindings
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [securityLevel, setSecurityLevel] = useState('Level 1');

  const [selectedSettingId, setSelectedSettingId] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [notification, setNotification] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadAdmins = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'admin'));
        if (isMounted) {
          setAdmins(snapshot.docs.map((adminDocument) => ({
            id: adminDocument.id,
            name: adminDocument.data().Name || adminDocument.data().name || 'Administrator',
            email: adminDocument.data().Email || adminDocument.id,
            securityLevel: adminDocument.data().SecurityLevel || 'Level 1',
          })));
        }
      } catch (error) {
        console.error('Failed to load admin profiles:', error);
        if (isMounted) {
          setNotification({ type: 'error', text: 'Unable to load admin profiles. Check Firestore permissions.' });
        }
      } finally {
        if (isMounted) setIsLoadingAdmins(false);
      }
    };

    loadAdmins();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSettingExecution = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setNotification(null);

    try {
      if (settingAction === 'create') {
        const email = adminEmail.trim().toLowerCase();
        const adminRef = doc(db, 'admin', email);
        const existingAdmin = await getDoc(adminRef);
        if (existingAdmin.exists()) {
          setNotification({ type: 'error', text: 'An admin profile already exists for this email address.' });
          return;
        }

        const newAdmin = {
          Name: adminName.trim(),
          Email: email,
          Role: 'admin',
          SecurityLevel: securityLevel,
          createdAt: serverTimestamp(),
          lastModifiedAt: serverTimestamp(),
        };
        await setDoc(adminRef, newAdmin);
        setAdmins((currentAdmins) => [...currentAdmins, {
          id: email,
          name: newAdmin.Name,
          email,
          securityLevel,
        }]);
        setNotification({ type: 'success', text: `Admin profile created for ${email}.` });
        setAdminName('');
        setAdminEmail('');
      } else if (settingAction === 'update') {
        await updateDoc(doc(db, 'admin', selectedSettingId), {
          Name: adminName.trim(),
          SecurityLevel: securityLevel,
          lastModifiedAt: serverTimestamp(),
        });
        setAdmins((currentAdmins) => currentAdmins.map((admin) => (
          admin.id === selectedSettingId
            ? { ...admin, name: adminName.trim(), securityLevel }
            : admin
        )));
        setNotification({ type: 'success', text: `Admin profile ${selectedSettingId} updated.` });
      } else {
        if (deleteConfirmation.trim().toLowerCase() !== 'confirm delete') {
          setNotification({ type: 'error', text: "Type 'confirm delete' exactly to remove the admin profile." });
          return;
        }
        if (auth.currentUser?.email?.toLowerCase() === selectedSettingId.toLowerCase()) {
          setNotification({ type: 'error', text: 'You cannot delete the admin profile currently signed in.' });
          return;
        }

        await deleteDoc(doc(db, 'admin', selectedSettingId));
        setAdmins((currentAdmins) => currentAdmins.filter((admin) => admin.id !== selectedSettingId));
        setSelectedSettingId('');
        setDeleteConfirmation('');
        setNotification({ type: 'success', text: `Admin profile ${selectedSettingId} deleted.` });
      }
    } catch (error) {
      console.error(`Failed to ${settingAction} admin profile:`, error);
      setNotification({ type: 'error', text: `Unable to ${settingAction} admin profile. Check Firestore permissions and try again.` });
    } finally {
      setIsProcessing(false);
    }
  };

  const actionModes = [
    { id: 'create', label: '1. Add / Create Admin', icon: '➕', color: 'emerald' },
    { id: 'update', label: '2. Edit Credentials', icon: '✏️', color: 'sky' },
    { id: 'delete', label: '3. Deprovision Node', icon: '🗑️', color: 'rose' },
  ];

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      {/* Title Header */}
      <div className="border-b border-slate-800 pb-5 mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <span className="text-amber-500">⚙️</span>
          <span>System Console Management Node</span>
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Configure master operational identifiers, setup root permissions parameters, or perform administrative data purges.
        </p>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className={`mb-6 p-4 rounded-xl border text-sm flex items-center gap-3 ${
          notification.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          <span>{notification.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{notification.text}</span>
        </div>
      )}

      {/* Action Segmented Switcher */}
      <div className="mb-8">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
          Select Management Action Task
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-800/60 p-1.5 rounded-2xl border border-slate-800">
          {actionModes.map((mode) => {
            const isSelected = settingAction === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  setSettingAction(mode.id);
                  setDeleteConfirmation('');
                  setNotification(null);
                }}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  isSelected
                    ? mode.id === 'create'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                      : mode.id === 'update'
                        ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
                        : 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{mode.icon}</span>
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSettingExecution} className="space-y-6">
        
        {/* VIEWPORT 1: CREATE NEW ADMIN */}
        {settingAction === 'create' && (
          <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Administrator Display Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm"
                placeholder="e.g., Jane Doe"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Account Contact Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm"
                placeholder="e.g., jane@escore.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Administrative Security Level
              </label>
              <select
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm cursor-pointer"
                value={securityLevel}
                onChange={(e) => setSecurityLevel(e.target.value)}
              >
                <option value="Level 1">Root Level Access (Level 1)</option>
                <option value="Level 2">Content Moderator Access (Level 2)</option>
              </select>
            </div>
          </div>
        )}

        {/* VIEWPORT 2: UPDATE CREDENTIALS */}
        {settingAction === 'update' && (
          <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Select Target Profile to Modulate
              </label>
              <select
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition text-sm cursor-pointer"
                value={selectedSettingId}
                onChange={(e) => {
                  const selectedAdmin = admins.find((admin) => admin.id === e.target.value);
                  setSelectedSettingId(e.target.value);
                  setAdminName(selectedAdmin?.name || '');
                  setAdminEmail(selectedAdmin?.email || '');
                  setSecurityLevel(selectedAdmin?.securityLevel || 'Level 1');
                }}
                required
              >
                <option value="">{isLoadingAdmins ? 'Loading admin profiles...' : '-- Choose Existing Console Account --'}</option>
                {admins.map((admin) => (
                  <option key={admin.id} value={admin.id}>{admin.name} ({admin.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Updated Administrator Display Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition text-sm"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Enter updated name..."
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Account Contact Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-400 cursor-not-allowed text-sm"
                value={adminEmail || selectedSettingId}
                disabled
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Administrative Security Level
              </label>
              <select
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition text-sm cursor-pointer"
                value={securityLevel}
                onChange={(e) => setSecurityLevel(e.target.value)}
              >
                <option value="Level 1">Root Level Access (Level 1)</option>
                <option value="Level 2">Content Moderator Access (Level 2)</option>
              </select>
            </div>
          </div>
        )}

        {/* VIEWPORT 3: DEPROVISION / DELETE */}
        {settingAction === 'delete' && (
          <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <strong className="font-semibold text-rose-200">CRITICAL SECURITY WARNING:</strong>
                <p className="mt-1 text-xs text-rose-300/90 leading-relaxed">
                  Deprovisioning this structural entry permanently revokes data access privileges across the entire E-Score administration matrix.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Select Administrative Access Node to Delete
              </label>
              <select
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition text-sm cursor-pointer"
                value={selectedSettingId}
                onChange={(e) => setSelectedSettingId(e.target.value)}
                required
              >
                <option value="">{isLoadingAdmins ? 'Loading admin profiles...' : '-- Select Targeted Registry Reference --'}</option>
                {admins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.name} ({admin.email}){auth.currentUser?.email?.toLowerCase() === admin.id.toLowerCase() ? ' (signed-in)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-rose-400 mb-2">
                Type <span className="font-mono font-bold bg-rose-500/20 px-1.5 py-0.5 rounded text-rose-200">confirm delete</span> below to verify authorization
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-slate-800/80 border border-rose-500/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition text-sm font-mono"
                placeholder="Verification passphrase entry..."
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
              settingAction === 'create'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
                : settingAction === 'update'
                  ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/25'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/25'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Operation...</span>
              </>
            ) : settingAction === 'create' ? (
              <>
                <span>➕</span>
                <span>Register New Console Profile</span>
              </>
            ) : settingAction === 'update' ? (
              <>
                <span>💾</span>
                <span>Commit Credential Updates</span>
              </>
            ) : (
              <>
                <span>🗑️</span>
                <span>Permanently Purge Access Records</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
