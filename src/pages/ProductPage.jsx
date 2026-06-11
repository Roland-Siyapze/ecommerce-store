import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PRODUCT_DETAIL, CREATE_CHECKOUT, ADD_TO_CART } from "../apollo/queries";
import { useCart } from "../context/CartContext";
import { PageContainerPosition } from "../components/PageContainerPosition";

export const ProductPage = () => {
  const { slug } = useParams();
  const { checkoutId, saveCheckout } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

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
        saveCheckout(data.checkoutCreate.checkout.id, data.checkoutCreate.checkout.lines);
      } else {
        const { data } = await addToCart({
          variables: { checkoutId, lines: [{ variantId: selectedVariant.id, quantity }] },
        });
        saveCheckout(checkoutId, data.checkoutLinesAdd.checkout.lines);
      }
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><p>Chargement...</p></div>;
  if (!product) return <div className="flex justify-center py-20"><p>Produit introuvable.</p></div>;

  const price = selectedVariant?.pricing?.price?.gross?.amount;
  const originalPrice = selectedVariant?.pricing?.priceUndiscounted?.gross?.amount;

  return (
    <div className="bg-primary-bg-page min-h-screen py-6">
      <PageContainerPosition>
        <div className="w-full">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-6 gap-1">
            <Link to="/" className="hover:text-secondary-text-color">Accueil</Link>
            {product.category && (
              <>
                <span>/</span>
                <Link to={`/category/${product.category.slug}`} className="hover:text-secondary-text-color">
                  {product.category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-primary-font-color">{product.name}</span>
          </div>

          <div className="flex gap-8 bg-white rounded p-6">
            {/* Product Image */}
            <div className="w-1/2">
              <img
                src={product.thumbnail?.url || "https://via.placeholder.com/500"}
                alt={product.name}
                className="w-full h-[400px] object-contain"
              />
              {/* Thumbnail gallery */}
              {product.images?.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {product.images.map((img, i) => (
                    <img key={i} src={img.url} alt="" className="h-16 w-16 object-cover border rounded cursor-pointer" />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="w-1/2">
              <h1 className="text-2xl font-bold text-primary-font-color">{product.name}</h1>

              <div className="mt-4">
                <span className="text-3xl font-bold text-secondary-text-color">
                  FCFA {price?.toLocaleString()}
                </span>
                {originalPrice && originalPrice !== price && (
                  <span className="ml-3 line-through text-gray-400 text-lg">
                    FCFA {originalPrice?.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Variants */}
              {product.variants?.length > 1 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Variante :</p>
                  <div className="flex gap-2 flex-wrap">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1 border rounded text-sm transition ${
                          selectedVariant?.id === v.id
                            ? "border-secondary-text-color text-secondary-text-color"
                            : "border-gray-300 hover:border-secondary-text-color"
                        }`}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-3">
                <p className="text-sm font-medium">Quantité :</p>
                <div className="flex items-center border rounded">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 text-lg">-</button>
                  <span className="px-4 py-1 border-x">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 text-lg">+</button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="mt-6 w-full bg-[#0A1174] text-white py-3 rounded font-medium text-lg hover:bg-blue-900 transition"
              >
                {addedToCart ? "✓ Ajouté au panier !" : "Ajouter au panier"}
              </button>

              <Link
                to="/cart"
                className="mt-3 w-full block text-center border border-secondary-text-color text-secondary-text-color py-3 rounded font-medium hover:bg-orange-50 transition"
              >
                Voir le panier
              </Link>

              {/* Description */}
              {product.description && (
                <div className="mt-6 text-sm text-gray-600">
                  <p className="font-medium mb-1">Description :</p>
                  <p>{JSON.parse(product.description)?.blocks?.[0]?.data?.text || ""}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageContainerPosition>
    </div>
  );
};