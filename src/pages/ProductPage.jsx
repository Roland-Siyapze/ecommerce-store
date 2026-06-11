import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PRODUCT_DETAIL, CREATE_CHECKOUT, ADD_TO_CART } from "../apollo/queries";
import { useCart } from "../context/CartContext";
import { Icon } from "@iconify/react";

export const ProductPage = () => {
  const { slug } = useParams();
  const { checkoutId, saveCheckout } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("details");

  const { data, loading } = useQuery(GET_PRODUCT_DETAIL, {
    variables: { slug, channel: "default-channel" },
    onCompleted: (data) => {
      if (data?.product?.variants?.length > 0) {
        setSelectedVariant(data.product.variants[0]);
      }
    },
  });

  const [createCheckout] = useMutation(CREATE_CHECKOUT);
  const [addToCart] = useMutation(ADD_TO_CART);

  const product = data?.product;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    try {
      if (!checkoutId) {
        const { data } = await createCheckout({
          variables: { lines: [{ variantId: selectedVariant.id, quantity }] },
        });
        saveCheckout(
          data.checkoutCreate.checkout.id,
          data.checkoutCreate.checkout.lines
        );
      } else {
        const { data } = await addToCart({
          variables: {
            checkoutId,
            lines: [{ variantId: selectedVariant.id, quantity }],
          },
        });
        saveCheckout(checkoutId, data.checkoutLinesAdd.checkout.lines);
      }
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0A1174]" />
      </div>
    );

  if (!product)
    return (
      <div className="flex justify-center py-20">
        <p>Produit introuvable.</p>
      </div>
    );

  const price = selectedVariant?.pricing?.price?.gross?.amount;
  const originalPrice =
    selectedVariant?.pricing?.priceUndiscounted?.gross?.amount;
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPct = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  // Build image list: thumbnail + all product images
  const allImages = [
    product.thumbnail?.url,
    ...(product.images?.map((i) => i.url) || []),
  ].filter(Boolean);

  // Parse description
  let descriptionBlocks = [];
  try {
    const parsed = JSON.parse(product.description || "{}");
    descriptionBlocks = parsed?.blocks || [];
  } catch (_) {}

  return (
    <div className="bg-primary-bg-page min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-4">

        {/* Breadcrumb */}
        <div className="flex items-center text-xs text-gray-400 mb-4 gap-1 flex-wrap">
          <Link to="/" className="hover:text-secondary-text-color">Accueil</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                to={`/category/${product.category.slug}`}
                className="hover:text-secondary-text-color"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-600 truncate max-w-xs">{product.name}</span>
        </div>

        {/* ── TOP SECTION: 3 columns ── */}
        <div className="flex gap-4 items-start bg-white rounded border border-gray-100 p-5">

          {/* COL 1 — Image gallery */}
          <div className="w-72 flex-shrink-0">
            <div className="bg-white rounded border border-gray-200 p-3 flex items-center justify-center h-64">
              <img
                src={allImages[activeImage] || "https://via.placeholder.com/300"}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`h-14 w-14 border-2 rounded overflow-hidden flex-shrink-0 transition ${
                      activeImage === i
                        ? "border-secondary-text-color"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
            {/* Share */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Partagez ce produit
              </p>
              <div className="flex gap-3">
                <button className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-80">
                  <Icon icon="mdi:facebook" height="16" />
                </button>
                <button className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80">
                  <Icon icon="mdi:twitter" height="16" />
                </button>
                <button className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:opacity-80">
                  <Icon icon="mdi:whatsapp" height="16" />
                </button>
              </div>
            </div>
            {/* Report */}
            <button className="mt-4 text-xs text-blue-500 hover:underline flex items-center gap-1">
              <Icon icon="mdi:flag-outline" height="14" />
              Signaler des informations incorrectes
            </button>
          </div>

          {/* COL 2 — Product info */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded border border-gray-200 p-4">

              {/* Offer badge */}
              {hasDiscount && (
                <span className="inline-block bg-secondary-text-color text-white text-xs font-bold px-3 py-1 rounded mb-3">
                  Offre Spéciale
                </span>
              )}

              {/* Title */}
              <div className="flex items-start justify-between gap-2">
                <h1 className="text-base font-bold text-gray-800 leading-snug flex-1">
                  {product.name}
                </h1>
                <button className="flex-shrink-0 text-gray-300 hover:text-red-400 transition">
                  <Icon icon="mdi:heart-outline" height="22" />
                </button>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl font-bold text-gray-800">
                  {price?.toLocaleString()} FCFA
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-sm line-through text-gray-400">
                      {originalPrice?.toLocaleString()} FCFA
                    </span>
                    <span className="text-sm font-bold text-secondary-text-color">
                      -{discountPct}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock warning */}
              <p className="text-xs text-secondary-text-color font-medium mt-2">
                <Icon icon="mdi:alert-circle-outline" height="14" className="inline mr-1" />
                Quelques articles restants
              </p>

              {/* Delivery info */}
              <p className="text-xs text-gray-500 mt-1">
                + livraison à partir de{" "}
                <span className="font-semibold text-gray-700">1,000 FCFA</span> vers votre ville
              </p>

              {/* Variants */}
              {product.variants?.length > 1 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2 uppercase">
                    Variante
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1 border rounded text-xs transition ${
                          selectedVariant?.id === v.id
                            ? "border-secondary-text-color bg-orange-50 text-secondary-text-color font-semibold"
                            : "border-gray-300 hover:border-secondary-text-color"
                        }`}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity + Add to cart */}
              <div className="flex items-center gap-3 mt-5">
                <div className="flex items-center border-2 border-secondary-text-color rounded overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 bg-secondary-text-color text-white hover:bg-orange-600 transition text-lg font-bold"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 bg-secondary-text-color text-white hover:bg-orange-600 transition text-lg font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-gray-400">
                  ({selectedVariant?.quantityAvailable || "∞"} disponible
                  {(selectedVariant?.quantityAvailable || 0) > 1 ? "s" : ""})
                </span>
              </div>

              {/* Promotions block */}
              <div className="mt-4 border border-gray-100 rounded p-3 bg-gray-50">
                <p className="text-xs font-bold text-gray-600 uppercase mb-2">
                  Promotions
                </p>
                <div className="flex items-start gap-2 text-xs text-blue-600 mb-2">
                  <Icon icon="mdi:phone" height="14" className="flex-shrink-0 mt-0.5" />
                  <span>Besoin d'aide pour commander ? Appelez-nous</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-secondary-text-color">
                  <Icon icon="mdi:star-circle" height="14" className="flex-shrink-0 mt-0.5 text-secondary-text-color" />
                  <span>
                    Jusqu'à <strong>-5.000F</strong> de frais de livraison sur vos commandes prépayées.
                    Minimum de commande 7.500F.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* COL 3 — Right sidebar */}
          <div className="w-64 flex-shrink-0 space-y-3">

            {/* Delivery & Returns */}
            <div className="bg-white rounded border border-gray-200 p-4">
              <h3 className="text-xs font-bold text-gray-600 uppercase mb-3 tracking-wide">
                Livraison & Retours
              </h3>

              {/* Express badge */}
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs font-bold text-[#0A1174]">FLASH</span>
                <span className="text-xs font-bold text-secondary-text-color">EXPRESS</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Livraison en 24h dans votre ville.{" "}
                <span className="text-blue-500 cursor-pointer hover:underline">
                  Détails
                </span>
              </p>

              {/* Location selector */}
              <p className="text-xs font-semibold text-gray-600 mb-2">
                Choisissez le lieu
              </p>
              <select className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-secondary-text-color mb-2">
                <option>Yaoundé</option>
                <option>Douala</option>
                <option>Bafoussam</option>
                <option>Garoua</option>
                <option>Bamenda</option>
                <option>Maroua</option>
                <option>Ngaoundéré</option>
              </select>
              <select className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-secondary-text-color mb-3">
                <option>Sélectionner le quartier</option>
                <option>Centre-ville</option>
                <option>Bastos</option>
                <option>Mvan</option>
              </select>

              {/* Point relais */}
              <div className="flex gap-2 p-2 bg-gray-50 rounded mb-2">
                <Icon
                  icon="mdi:map-marker-outline"
                  height="20"
                  className="text-[#0A1174] flex-shrink-0 mt-0.5"
                />
                <div>
                  <div className="flex justify-between">
                    <p className="text-xs font-semibold">Point relais</p>
                    <span className="text-xs text-blue-500 cursor-pointer">Détails</span>
                  </div>
                  <p className="text-xs text-gray-500">Frais de livraison: 1,000 FCFA</p>
                  <p className="text-xs text-gray-400">Prêt pour le retrait dans 2-3 jours</p>
                </div>
              </div>

              {/* Return policy */}
              <div className="flex gap-2 p-2 bg-gray-50 rounded">
                <Icon
                  icon="mdi:refresh"
                  height="20"
                  className="text-[#0A1174] flex-shrink-0 mt-0.5"
                />
                <div>
                  <div className="flex justify-between">
                    <p className="text-xs font-semibold">Politique de retour</p>
                    <span className="text-xs text-blue-500 cursor-pointer">Détails</span>
                  </div>
                  <p className="text-xs text-gray-500">Retours gratuits sur 10 jours.</p>
                </div>
              </div>
            </div>

            {/* Vendor info */}
            <div className="bg-white rounded border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                  Informations sur le vendeur
                </h3>
                <Icon icon="mdi:chevron-right" height="16" className="text-gray-400" />
              </div>
              <p className="text-sm font-bold text-gray-800">Flash Shop Official</p>
              <div className="flex items-center gap-1 mt-1 mb-2">
                <span className="text-xs text-gray-500">90% Évaluation</span>
                <span className="text-gray-300 mx-1">·</span>
                <span className="text-xs text-gray-500">Vendeur vérifié</span>
              </div>
              <button className="w-full border border-secondary-text-color text-secondary-text-color text-xs font-semibold py-1.5 rounded hover:bg-orange-50 transition mb-3">
                Suivre
              </button>
              <div className="space-y-1">
                {[
                  ["Vitesse d'expédition", "Excellent"],
                  ["Score Qualité", "Bon"],
                  ["Avis consommateurs", "Moyen"],
                  ["Taux d'annulation", "Excellent"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center gap-1">
                    <Icon
                      icon="mdi:check-circle"
                      height="12"
                      className="text-green-500 flex-shrink-0"
                    />
                    <span className="text-xs text-gray-600">
                      {label}:{" "}
                      <span className="font-semibold">{value}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM SECTION: tabs + sticky buy ── */}
        <div className="flex gap-4 mt-4 items-start">

          {/* Tabs content */}
          <div className="flex-1 bg-white rounded border border-gray-100">
            {/* Tab headers */}
            <div className="flex border-b border-gray-100">
              {[
                { id: "details", label: "Détails", icon: "mdi:file-document-outline" },
                { id: "specs", label: "Fiche technique", icon: "mdi:format-list-bulleted" },
                { id: "reviews", label: "Commentaires clients vérifiés", icon: "mdi:comment-outline" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-medium transition border-b-2 ${
                    activeTab === tab.id
                      ? "border-[#0A1174] text-[#0A1174] bg-gray-50"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon icon={tab.icon} height="14" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab body */}
            <div className="p-5">
              {activeTab === "details" && (
                <div>
                  <h2 className="text-sm font-bold mb-3">Détails</h2>
                  {descriptionBlocks.length > 0 ? (
                    <div className="text-xs text-gray-600 space-y-2">
                      {descriptionBlocks.map((block, i) => (
                        <p key={i}>{block?.data?.text || ""}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">
                      Aucune description disponible pour ce produit.
                    </p>
                  )}
                  {/* Specs table */}
                  <div className="mt-4 text-xs">
                    <p className="font-bold mb-2">Spécification</p>
                    <table className="w-full text-xs">
                      <tbody>
                        {[
                          ["Catégorie", product.category?.name || "—"],
                          ["Référence", selectedVariant?.sku || "—"],
                          ["Disponibilité", selectedVariant?.quantityAvailable > 0 ? "En stock" : "Rupture de stock"],
                        ].map(([key, val]) => (
                          <tr key={key} className="border-b border-gray-50">
                            <td className="py-1.5 font-semibold text-gray-600 w-1/3">{key}</td>
                            <td className="py-1.5 text-gray-500">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "specs" && (
                <div>
                  <h2 className="text-sm font-bold mb-3">Fiche technique</h2>
                  <table className="w-full text-xs">
                    <tbody>
                      {[
                        ["Nom", product.name],
                        ["Catégorie", product.category?.name || "—"],
                        ["SKU", selectedVariant?.sku || "—"],
                        ["Stock disponible", selectedVariant?.quantityAvailable ?? "—"],
                      ].map(([key, val]) => (
                        <tr key={key} className="border-b border-gray-100">
                          <td className="py-2 font-semibold text-gray-600 w-1/3 bg-gray-50 px-2">{key}</td>
                          <td className="py-2 text-gray-600 px-2">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <h2 className="text-sm font-bold mb-3">Commentaires clients</h2>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex text-secondary-text-color">
                      {[1, 2, 3, 4].map((s) => (
                        <Icon key={s} icon="mdi:star" height="18" />
                      ))}
                      <Icon icon="mdi:star-outline" height="18" />
                    </div>
                    <span className="text-xs text-gray-500">4.0 / 5 — Basé sur les avis clients</span>
                  </div>
                  <p className="text-xs text-gray-400 italic">
                    Aucun commentaire pour l'instant. Soyez le premier à laisser un avis !
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sticky buy widget */}
          <div className="w-64 flex-shrink-0 bg-white rounded border border-gray-100 p-4">
            {/* Mini product recap */}
            <div className="flex gap-2 mb-3">
              <img
                src={product.thumbnail?.url || "https://via.placeholder.com/60"}
                alt=""
                className="h-12 w-12 object-contain flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs text-gray-600 truncate">{product.name}</p>
                <p className="text-sm font-bold text-gray-800">
                  {price?.toLocaleString()} FCFA
                </p>
                {hasDiscount && (
                  <p className="text-xs line-through text-gray-400">
                    {originalPrice?.toLocaleString()} FCFA
                  </p>
                )}
                {hasDiscount && (
                  <span className="text-xs font-bold text-secondary-text-color">
                    -{discountPct}%
                  </span>
                )}
              </div>
            </div>

            {/* Buy button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-secondary-text-color text-white py-2.5 rounded font-bold text-sm hover:bg-orange-600 transition flex items-center justify-center gap-2"
            >
              <Icon icon="mdi:cart-outline" height="18" />
              {addedToCart ? "✓ Ajouté !" : "J'achète"}
            </button>

            <Link
              to="/cart"
              className="block mt-2 w-full text-center text-xs text-gray-500 hover:text-secondary-text-color py-1"
            >
              Voir le panier →
            </Link>

            {/* Chat */}
            <div className="mt-3 border-t pt-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Avez-vous des questions ?</p>
              <button className="flex items-center justify-center gap-1 text-secondary-text-color text-xs font-semibold mx-auto hover:underline">
                <Icon icon="mdi:chat-outline" height="16" />
                Chat
              </button>
            </div>
          </div>
        </div>

        {/* Sponsored products placeholder */}
        <div className="mt-6 bg-white rounded border border-gray-100 p-4">
          <h2 className="text-sm font-bold mb-3">Produits sponsorisés</h2>
          <p className="text-xs text-gray-400 italic">
            Des produits similaires apparaîtront ici.
          </p>
        </div>

      </div>
    </div>
  );
};