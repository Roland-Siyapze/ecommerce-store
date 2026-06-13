import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CATEGORY_BY_SLUG } from "../apollo/queries";
import BottomSliderCard from "../components/sliders/BottomSliderCard";
import { CategoryNavigationMenu } from "../components/NavigationMenu/CategoryNavigationMenu";
import { Icon } from "@iconify/react";
import { CHANNEL_ID } from "../config/constants";

export const CategoryPage = () => {
  const { slug, parentSlug } = useParams();
  const activeSlug = slug || parentSlug;

  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [appliedMin, setAppliedMin] = useState(null);
  const [appliedMax, setAppliedMax] = useState(null);
  const [sortBy, setSortBy] = useState("Nouveau");
  const [priceOpen, setPriceOpen] = useState(true);

  const { data, loading, error } = useQuery(GET_CATEGORY_BY_SLUG, {
    variables: { slug: activeSlug, channel: CHANNEL_ID, first: 100 },
  });

  const category = data?.category;
  const breadcrumbs = category?.ancestors?.edges || [];
  const subcategories = category?.children?.edges || [];

  // Filter and sort products client-side
  let products = (category?.products?.edges || []).map(({ node }) => node);

  // Debug logging
  React.useEffect(() => {
    if (!loading) {
      console.log('CategoryPage - Channel:', CHANNEL_ID);
      console.log('CategoryPage - Category:', category);
      console.log('CategoryPage - Products:', products);
      console.log('CategoryPage - Error:', error);
    }
  }, [loading, category, products, error]);

  if (appliedMin !== null) {
    products = products.filter(
      (p) => (p.pricing?.priceRange?.start?.gross?.amount || 0) >= appliedMin
    );
  }
  if (appliedMax !== null) {
    products = products.filter(
      (p) => (p.pricing?.priceRange?.start?.gross?.amount || 0) <= appliedMax
    );
  }

  if (sortBy === "Prix croissant") {
    products = [...products].sort(
      (a, b) =>
        (a.pricing?.priceRange?.start?.gross?.amount || 0) -
        (b.pricing?.priceRange?.start?.gross?.amount || 0)
    );
  } else if (sortBy === "Prix décroissant") {
    products = [...products].sort(
      (a, b) =>
        (b.pricing?.priceRange?.start?.gross?.amount || 0) -
        (a.pricing?.priceRange?.start?.gross?.amount || 0)
    );
  }

  const handleApplyPrice = () => {
    setAppliedMin(Number(minPrice));
    setAppliedMax(Number(maxPrice));
  };

  return (
    <div className="bg-primary-bg-page min-h-screen">
      {/* Top Banner Slider */}
      <BottomSliderCard />

      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-4 gap-1 flex-wrap">
          <Link to="/" className="hover:text-secondary-text-color">
            Accueil
          </Link>
          {breadcrumbs.map(({ node }) => (
            <span key={node.id} className="flex items-center gap-1">
              <span>/</span>
              <Link
                to={`/category/${node.slug}`}
                className="hover:text-secondary-text-color"
              >
                {node.name}
              </Link>
            </span>
          ))}
          <span>/</span>
          <span className="text-primary-font-color font-medium">
            {category?.name || "Catégorie"}
          </span>
        </div>

        {/* Subcategory pills */}
        {subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {subcategories.map(({ node }) => (
              <Link
                key={node.id}
                to={`/category/${activeSlug}/${node.slug}`}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs hover:border-secondary-text-color hover:text-secondary-text-color transition"
              >
                {node.name}
              </Link>
            ))}
          </div>
        )}

        <div className="flex gap-4">
          {/* ── LEFT SIDEBAR FILTERS ── */}
          {/* ── LEFT SIDEBAR ── */}
          <div className="w-48 flex-shrink-0 space-y-3">
            {/* Subcategories from CategoryNavigationMenu */}
            <CategoryNavigationMenu />

            {/* Price filter */}
            <div className="bg-white rounded shadow-sm p-3">
                <h2 className="font-bold text-sm mb-3">Filtres</h2>
                <div className="border-t pt-2">
                <button
                    className="flex items-center justify-between w-full text-sm font-medium py-1"
                    onClick={() => setPriceOpen(!priceOpen)}
                >
                    <span>Prix (XAF)</span>
                    <Icon icon={priceOpen ? "mdi:chevron-up" : "mdi:chevron-down"} height="18" />
                </button>

                {priceOpen && (
                    <div className="mt-2">
                    <div className="flex items-center gap-1 mb-1">
                        <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Prix min</p>
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-secondary-text-color"
                        />
                        </div>
                        <span className="mt-5 text-gray-400">-</span>
                        <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Prix max</p>
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-secondary-text-color"
                        />
                        </div>
                    </div>
                    <button
                        onClick={handleApplyPrice}
                        className="w-full bg-secondary-text-color text-white rounded py-1 text-xs mt-1 hover:bg-orange-600 transition"
                    >
                        Go
                    </button>
                    {(appliedMin !== null || appliedMax !== null) && (
                        <button
                        onClick={() => {
                            setAppliedMin(null);
                            setAppliedMax(null);
                            setMinPrice(100);
                            setMaxPrice(1000000);
                        }}
                        className="w-full text-xs text-gray-400 hover:text-red-500 mt-1"
                        >
                        Réinitialiser
                        </button>
                    )}
                    </div>
                )}
                </div>
            </div>
          </div>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1">
            {/* Results bar */}
            <div className="bg-white rounded shadow-sm px-4 py-3 flex items-center justify-between mb-3">
              <p className="text-sm text-gray-600">
                <span className="font-bold text-primary-font-color">
                  {loading ? "..." : products.length}
                </span>{" "}
                produit{products.length !== 1 ? "s" : ""} trouvé
                {products.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-2">
                <Icon icon="mdi:sort" height="16" className="text-gray-500" />
                <span className="text-sm text-gray-500">Trier Par :</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-secondary-text-color"
                >
                  <option>Nouveau</option>
                  <option>Prix croissant</option>
                  <option>Prix décroissant</option>
                </select>
                <button className="border border-gray-200 rounded p-1 hover:border-secondary-text-color">
                  <Icon icon="mdi:arrow-down" height="16" />
                </button>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="grid grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded h-72 animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-white rounded p-10 text-center text-red-400">
                Erreur de chargement. Veuillez réessayer.
              </div>
            )}

            {/* Empty */}
            {!loading && !error && products.length === 0 && (
              <div className="bg-white rounded p-16 text-center text-gray-400">
                <Icon
                  icon="mdi:package-variant-closed"
                  height="48"
                  className="mx-auto mb-3 opacity-30"
                />
                <p>Aucun produit trouvé dans cette catégorie.</p>
                <Link
                  to="/"
                  className="mt-4 inline-block text-secondary-text-color hover:underline text-sm"
                >
                  ← Retour à l'accueil
                </Link>
              </div>
            )}

            {/* Products Grid — 4 columns like the screenshot */}
            {!loading && products.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {products.map((node) => {
                  const price =
                    node.pricing?.priceRange?.start?.gross?.amount;
                  const originalPrice =
                    node.pricing?.priceRange?.stop?.gross?.amount;
                  const hasDiscount =
                    originalPrice && originalPrice > price;
                  const discountPct =
                    hasDiscount
                      ? Math.round(
                          ((originalPrice - price) / originalPrice) * 100
                        )
                      : null;

                  return (
                    <Link
                      key={node.id}
                      to={`/product/${node.slug}`}
                      className="bg-white rounded overflow-hidden hover:shadow-lg transition group flex flex-col"
                    >
                      {/* Image */}
                      <div className="relative">
                        <img
                          src={
                            node.thumbnail?.url ||
                            "https://via.placeholder.com/300"
                          }
                          alt={node.name}
                          className="h-[180px] w-full object-contain p-2"
                        />
                        {hasDiscount && (
                          <span className="absolute bottom-2 right-2 bg-secondary-text-color text-white text-xs font-bold px-2 py-0.5 rounded">
                            -{discountPct}%
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-2 flex-1 flex flex-col">
                        <h3 className="text-xs text-gray-700 leading-snug mb-2 flex-1">
                          {node.name.length > 60
                            ? node.name.slice(0, 60) + "..."
                            : node.name}
                        </h3>

                        <div>
                          <p className="font-bold text-primary-font-color text-sm">
                            {price?.toLocaleString()} FCFA
                          </p>
                          {hasDiscount && (
                            <p className="line-through text-xs text-gray-400">
                              {originalPrice?.toLocaleString()} FCFA
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Buy button */}
                      <button className="w-full bg-[#0A1174] text-white py-2 text-xs font-medium hover:bg-blue-900 transition">
                        ACHETER
                      </button>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};