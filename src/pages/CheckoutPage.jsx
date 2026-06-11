import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { PageContainerPosition } from "../components/PageContainerPosition";

export const CheckoutPage = () => {
  const { cartItems } = useCart();

  return (
    <div className="bg-primary-bg-page min-h-screen py-6">
      <PageContainerPosition>
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-6">Finaliser la commande</h1>
          <div className="bg-white rounded p-6 text-center">
            <p className="text-gray-500 mb-4">
              Le paiement sera intégré prochainement (Mobile Money, Carte bancaire).
            </p>
            <Link to="/cart" className="text-secondary-text-color hover:underline">
              ← Retour au panier
            </Link>
          </div>
        </div>
      </PageContainerPosition>
    </div>
  );
};