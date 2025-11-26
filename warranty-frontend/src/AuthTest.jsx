import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function AuthTest() {
  const [session, setSession] = useState(null);

  // Load session automatically on page load
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log("session on load:", data.session);
      setSession(data.session);
    });

    // Listen for login / logout events
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("auth changed:", session);
      setSession(session);
    });
  }, []);

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    console.log("google oauth:", data, error);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Google OAuth Test</h1>

      <button onClick={signInWithGoogle}>
        Sign In with Google
      </button>

      {session ? (
        <>
          <h2>Logged In</h2>
          <p><strong>Email:</strong> {session.user.email}</p>

          <h3>Access Token:</h3>
          <textarea
            value={session.access_token}
            readOnly
            rows={6}
            cols={50}
          />

          <br /><br />
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <h3>Not logged in</h3>
      )}
    </div>
  );
}
