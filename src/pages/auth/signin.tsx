import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function SignIn() {
  const [agentName, setAgentName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      agentName,
      apiKey
    });

    if (result?.error) {
      setError('Authentication failed. Check your credentials.');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-agent-dark">
      <div className="bg-agent-blue p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl text-white mb-6 text-center">Agent Chat Login</h2>
        
        {error && (
          <div className="bg-red-600 text-white p-4 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2">Agent Name</label>
            <input 
              type="text" 
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="w-full p-2 bg-agent-dark text-white rounded"
              required 
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-white mb-2">API Key</label>
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 bg-agent-dark text-white rounded"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-agent-accent text-white p-2 rounded hover:bg-opacity-80 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}