import { useState } from 'react';
import { IdentitySetup } from './components/IdentitySetup';
import { WardrobePage } from './pages/WardrobePage';

const IDENTITY_STORAGE_KEY = 'smart_wardrobe_identity_public_id';

export default function App() {
  const [identityPublicId, setIdentityPublicId] = useState<string | null>(() => {
    return localStorage.getItem(IDENTITY_STORAGE_KEY);
  });

  function handleIdentityReady(publicId: string) {
    localStorage.setItem(IDENTITY_STORAGE_KEY, publicId);
    setIdentityPublicId(publicId);
  }

  function handleClearIdentity() {
    localStorage.removeItem(IDENTITY_STORAGE_KEY);
    setIdentityPublicId(null);
  }

  if (!identityPublicId) {
    return <IdentitySetup onIdentityReady={handleIdentityReady} />;
  }

  return (
    <WardrobePage
      identityPublicId={identityPublicId}
      onClearIdentity={handleClearIdentity}
    />
  );
}
