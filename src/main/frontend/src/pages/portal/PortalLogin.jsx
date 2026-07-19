import { Navigate } from 'react-router-dom';

/**
 * Legacy-Redirect: /portal/login wird jetzt über /admin/login abgewickelt.
 * Diese Komponente existiert nur noch für Abwärtskompatibilität.
 */
export const PortalLogin = () => {
  return <Navigate to="/admin/login" replace />;
};
