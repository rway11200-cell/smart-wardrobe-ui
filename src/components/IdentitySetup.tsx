import { FormEvent, useState } from 'react';
import { createIdentity } from '../api/client';

type IdentitySetupProps = {
  onIdentityReady: (publicId: string) => void;
};

export function IdentitySetup({ onIdentityReady }: IdentitySetupProps) {
  const [displayName, setDisplayName] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [homeCountry, setHomeCountry] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const identity = await createIdentity({
        display_name: displayName,
        home_city: homeCity,
        home_country: homeCountry,
      });

      onIdentityReady(identity.public_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create identity.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page narrow-page">
      <section className="panel">
        <p className="eyebrow">Smart Wardrobe</p>
        <h1>Create your identity</h1>
        <p className="muted">
          This first identity lets the frontend read and write wardrobe data through the API.
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Display name
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Sebastian"
              required
            />
          </label>

          <label>
            Home city
            <input
              value={homeCity}
              onChange={(event) => setHomeCity(event.target.value)}
              placeholder="Buin"
              required
            />
          </label>

          <label>
            Home country
            <input
              value={homeCountry}
              onChange={(event) => setHomeCountry(event.target.value)}
              placeholder="Chile"
              required
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create identity'}
          </button>
        </form>
      </section>
    </main>
  );
}
