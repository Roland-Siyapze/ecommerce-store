import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { PageContainerPosition } from "../components/PageContainerPosition";
import { Button } from "../components/Button";
import { Input } from "../components/InputTypeCategory/Input";
import { useMutation } from "@apollo/client";
import {
  CHECKOUT_EMAIL_UPDATE,
  CHECKOUT_SHIPPING_ADDRESS_UPDATE,
  CHECKOUT_BILLING_ADDRESS_UPDATE
} from "../apollo/queries";

export const CheckoutPage = () => {
  const { cartItems, checkoutId, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    streetAddress1: "",
    city: "",
    country: "CM", // Default to Cameroon based on previous convo
    phone: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [updateEmail] = useMutation(CHECKOUT_EMAIL_UPDATE);
  const [updateShipping] = useMutation(CHECKOUT_SHIPPING_ADDRESS_UPDATE);
  const [updateBilling] = useMutation(CHECKOUT_BILLING_ADDRESS_UPDATE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkoutId) {
      setError("Panier vide ou invalide.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      if (user?.email) {
        await updateEmail({ variables: { id: checkoutId, email: user.email } });
      }

      const addressInput = {
        firstName: address.firstName,
        lastName: address.lastName,
        streetAddress1: address.streetAddress1,
        city: address.city,
        country: address.country,
        phone: address.phone
      };

      const shippingRes = await updateShipping({
        variables: { id: checkoutId, shippingAddress: addressInput }
      });

      if (shippingRes.data.checkoutShippingAddressUpdate.errors?.length > 0) {
        throw new Error(shippingRes.data.checkoutShippingAddressUpdate.errors[0].message);
      }

      const billingRes = await updateBilling({
        variables: { id: checkoutId, billingAddress: addressInput }
      });

      if (billingRes.data.checkoutBillingAddressUpdate.errors?.length > 0) {
        throw new Error(billingRes.data.checkoutBillingAddressUpdate.errors[0].message);
      }

      setSuccess(true);
      clearCart();
      // Wait for a bit then redirect to a success page or back to home
      setTimeout(() => navigate("/"), 3000);

    } catch (err) {
      console.error(err);
      setError(err.message || "Une erreur est survenue lors de la validation.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-primary-bg-page min-h-screen py-10 text-center">
        <PageContainerPosition>
          <div className="bg-white p-10 rounded shadow">
            <h1 className="text-3xl font-bold text-green-600 mb-4">Commande Validée !</h1>
            <p className="text-gray-600">Vos informations de livraison ont été enregistrées. Le paiement sera intégré prochainement.</p>
          </div>
        </PageContainerPosition>
      </div>
    );
  }

  return (
    <div className="bg-primary-bg-page min-h-screen py-6">
      <PageContainerPosition>
        <div className="w-full flex gap-6">
          <div className="flex-1 bg-white rounded p-6 shadow-sm">
            <h1 className="text-2xl font-bold mb-6">Adresse de livraison</h1>
            {!user && (
              <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded text-sm">
                Vous n'êtes pas connecté. <Link to="/login" className="underline font-bold">Connectez-vous</Link> pour un paiement plus rapide.
              </div>
            )}

            {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded text-sm">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Prénom</label>
                  <Input inputType="text" required value={address.firstName} onChange={e => setAddress({...address, firstName: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <Input inputType="text" required value={address.lastName} onChange={e => setAddress({...address, lastName: e.target.value})} className="w-full border p-2 rounded" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Adresse</label>
                <Input inputType="text" required value={address.streetAddress1} onChange={e => setAddress({...address, streetAddress1: e.target.value})} className="w-full border p-2 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ville</label>
                  <Input inputType="text" required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone</label>
                  <Input inputType="text" required value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="w-full border p-2 rounded" />
                </div>
              </div>

              <Button secondary className="w-full justify-center p-3 mt-4 rounded text-white bg-secondary-text-color hover:bg-opacity-90" disabled={loading || cartItems.length === 0}>
                {loading ? "Traitement en cours..." : "Valider l'adresse"}
              </Button>
            </form>
          </div>

          <div className="w-80 bg-white rounded p-6 shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-4">Résumé ({cartItems.length})</h2>
            <div className="space-y-4 mb-6">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="truncate pr-2">{item.quantity}x {item.variant.product.name}</span>
                  <span className="whitespace-nowrap font-medium">{item.variant.pricing.price.gross.amount} {item.variant.pricing.price.gross.currency}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageContainerPosition>
    </div>
  );
};