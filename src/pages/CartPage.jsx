import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { PageContainerPosition } from "../components/PageContainerPosition";

export const CartPage = () => {
  const { cartItems, cartCount } = useCart();

  const total = cartItems.reduce((acc, line) => {
    return acc + (line.variant?.pricing?.price?.gross?.amount || 0) * line.quantity;
  }, 0);

  return (
    <div className="bg-primary-bg-page min-h-screen py-6">
      <PageContainerPosition>
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-6">Mon Panier ({cartCount} article{cartCount > 1 ? "s" : ""})</h1>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded p-12 text-center">
              <p className="text-gray-400 text-lg mb-4">Votre panier est vide.</p>
              <Link to="/" className="bg-[#0A1174] text-white px-6 py-3 rounded hover:bg-blue-900">
                Continuer les achats
              </Link>
            </div>
          ) : (
            <div className="flex gap-6">
              {/* Cart Items */}
              <div className="flex-1 space-y-3">
                {cartItems.map((line) => (
                  <div key={line.id} className="bg-white rounded p-4 flex gap-4 items-center">
                    <img
                      src={line.variant?.product?.thumbnail?.url || "https://via.placeholder.com/100"}
                      alt={line.variant?.product?.name}
                      className="h-20 w-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{line.variant?.product?.name}</p>
                      <p className="text-sm text-gray-500">{line.variant?.name}</p>
                      <p className="text-secondary-text-color font-bold mt-1">
                        FCFA {line.variant?.pricing?.price?.gross?.amount?.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 border rounded">{line.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="w-72">
                <div className="bg-white rounded p-4">
                  <h2 className="font-bold text-lg mb-4">Résumé de la commande</h2>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Sous-total</span>
                    <span>FCFA {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-4 text-sm">
                    <span>Livraison</span>
                    <span className="text-green-600">Calculé à la caisse</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-3">
                    <span>Total</span>
                    <span>FCFA {total.toLocaleString()}</span>
                  </div>
                  <Link
                    to="/checkout"
                    className="block mt-4 w-full bg-secondary-text-color text-white text-center py-3 rounded font-medium hover:bg-orange-600 transition"
                  >
                    Passer la commande
                  </Link>
                  <Link
                    to="/"
                    className="block mt-2 w-full text-center text-sm text-gray-500 hover:text-secondary-text-color"
                  >
                    Continuer les achats
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageContainerPosition>
    </div>
  );
};