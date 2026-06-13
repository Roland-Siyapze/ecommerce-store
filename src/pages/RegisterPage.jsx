import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ACCOUNT_REGISTER } from "../apollo/queries";
import { PageContainerPosition } from "../components/PageContainerPosition";
import { Button } from "../components/Button";
import { Input } from "../components/InputTypeCategory/Input";
import { CHANNEL_ID } from "../config/constants";

export const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  
  const [accountRegister, { loading }] = useMutation(ACCOUNT_REGISTER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      const { data } = await accountRegister({
        variables: { 
          input: { 
            email, 
            password,
            firstName,
            lastName,
            channel: CHANNEL_ID,
            redirectUrl: "http://localhost:3000/login"
          } 
        },
      });

      if (data.accountRegister.errors && data.accountRegister.errors.length > 0) {
        setError(data.accountRegister.errors[0].message);
        return;
      }

      if (data.accountRegister.user) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de l'inscription.");
    }
  };

  return (
    <div className="bg-primary-bg-page min-h-screen py-10">
      <PageContainerPosition>
        <div className="max-w-md mx-auto bg-white rounded p-8 shadow-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Créer un compte</h1>
          {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">Compte créé avec succès ! Redirection vers la page de connexion...</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Prénom</label>
              <Input
                inputType="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Nom</label>
              <Input
                inputType="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
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
              {loading ? "Création en cours..." : "S'inscrire"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="text-secondary-text-color hover:underline">
              Se connecter
            </Link>
          </div>
        </div>
      </PageContainerPosition>
    </div>
  );
};
