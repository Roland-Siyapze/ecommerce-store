import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { TOKEN_CREATE } from "../apollo/queries";
import { useAuth } from "../context/AuthContext";
import { PageContainerPosition } from "../components/PageContainerPosition";
import { Button } from "../components/Button";
import { Input } from "../components/InputTypeCategory/Input";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [tokenCreate, { loading }] = useMutation(TOKEN_CREATE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await tokenCreate({
        variables: { email, password },
      });

      if (data.tokenCreate.errors && data.tokenCreate.errors.length > 0) {
        setError(data.tokenCreate.errors[0].message);
        return;
      }

      if (data.tokenCreate.token) {
        login(data.tokenCreate.token, data.tokenCreate.user);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de la connexion.");
    }
  };

  return (
    <div className="bg-primary-bg-page min-h-screen py-10">
      <PageContainerPosition>
        <div className="max-w-md mx-auto bg-white rounded p-8 shadow-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>
          {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Adresse e-mail</label>
              <Input
                inputType="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Mot de passe</label>
              <Input
                inputType="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <Button secondary className="w-full justify-center p-3 rounded text-white bg-secondary-text-color hover:bg-opacity-90" disabled={loading}>
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            Vous n'avez pas de compte ?{" "}
            <Link to="/register" className="text-secondary-text-color hover:underline">
              S'inscrire
            </Link>
          </div>
        </div>
      </PageContainerPosition>
    </div>
  );
};
