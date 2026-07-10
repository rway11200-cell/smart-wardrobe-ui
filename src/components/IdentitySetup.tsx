import { FormEvent, useState } from 'react';
import { createIdentity, getIdentityByNickname } from '../api/client';

type IdentitySetupProps = {
  onIdentityReady: (publicId: string) => void;
};

export function IdentitySetup({ onIdentityReady }: IdentitySetupProps) {
  const [displayName, setDisplayName] = useState('');
  const [nickname, setNickname] = useState('');
  const [existingNickname, setExistingNickname] = useState('');
  const [createError, setCreateError] = useState('');
  const [existingError, setExistingError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError('');
    setIsCreating(true);

    try {
      const identity = await createIdentity({
        display_name: displayName,
        nickname,
      });

      onIdentityReady(identity.public_id);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Could not create identity.');
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUseExisting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setExistingError('');
    setIsContinuing(true);

    const nickname = existingNickname.trim();

    try {
      const identity = await getIdentityByNickname(nickname);
      onIdentityReady(identity.public_id);
    } catch (err) {
      setExistingError(err instanceof Error ? err.message : 'Could not find that identity.');
    } finally {
      setIsContinuing(false);
    }
  }

  return (
    <main className="page narrow-page">
      <section className="panel identity-panel">
        <div>
          <p className="eyebrow">Smart Wardrobe</p>
          <h1>Create your identity</h1>
          <p className="muted">
            Hi!!
          </p>
          <p className="muted">
            This first identity lets the frontend read and write wardrobe data through the API. The nickname is what you will use to continue later.
          </p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Display name
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Demo User"
              required
            />
          </label>

          <label>
            Nickname
            <input
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="demo_user"
              required
              minLength={3}
              maxLength={50}
              pattern="[a-zA-Z0-9_-]+"
            />
          </label>

          {createError && <p className="error">{createError}</p>}

          <button type="submit" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create identity'}
          </button>
        </form>

        <div className="divider" />

        <div>
          <h2>Use existing identity</h2>
          <p className="muted">
            Use your nickname to continue with an identity that already exists.
          </p>
        </div>

        <form className="form" onSubmit={handleUseExisting}>
          <label>
            Nickname
            <input
              value={existingNickname}
              onChange={(event) => setExistingNickname(event.target.value)}
              placeholder="demo_user"
              required
              minLength={3}
              maxLength={50}
              pattern="[a-zA-Z0-9_-]+"
            />
          </label>

          {existingError && <p className="error">{existingError}</p>}

          <button type="submit" className="secondary-button" disabled={isContinuing}>
            {isContinuing ? 'Checking...' : 'Continue'}
          </button>
        </form>
      </section>
    </main>
  );
}
