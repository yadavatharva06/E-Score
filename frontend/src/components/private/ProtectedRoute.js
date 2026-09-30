import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';

function ProtectedRoute({ allowedRole }) {
  const [accessState, setAccessState] = useState('checking');

  useEffect(() => {
    let isActive = true;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user?.email) {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        if (isActive) setAccessState('denied');
        return;
      }

      try {
        const collectionName = allowedRole === 'admin' ? 'admin' : 'users';
        const roleDocument = await getDoc(doc(db, collectionName, user.email));
        const profile = roleDocument.exists() ? roleDocument.data() : null;
        const isSuspendedStudent = allowedRole === 'student' && profile?.status === 'Suspended';
        const hasAllowedRole = profile?.Role === allowedRole && !isSuspendedStudent;

        if (hasAllowedRole) {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', allowedRole);
          if (isActive) setAccessState('allowed');
        } else {
          if (isSuspendedStudent) await signOut(auth);
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('userRole');
          if (isActive) setAccessState('denied');
        }
      } catch {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        if (isActive) setAccessState('denied');
      }
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [allowedRole]);

  if (accessState === 'checking') {
    return <div role="status" aria-live="polite">Verifying access...</div>;
  }

  if (accessState === 'denied') {
    return <Navigate to={allowedRole === 'admin' ? '/admin-login' : '/user-login'} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
