import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { SEARCH_PRODUCTS } from "../apollo/queries";
import { PageContainerPosition } from "../components/PageContainerPosition";

export const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  const { data, loading } = useQuery(SEARCH_PRODUCTS, {
    variables: { query, channel: "default-channel", first: 24 },
    skip: !query,
  });

  const products = data?.products?.edges || [];

  return (
    <div className="bg-primary-bg-page min-h-screen py-6">
      <PageContainerPosition>
        <div className="w-full">
          <h1 className="text-xl font-bold mb-4">
            Résultats pour : <span className="text-secondary-text-color">"{query}"</span>
          </h1>

          {loading && <p className="text-center py-10">Recherche en cours...</p>}

          {!loading && products.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              Aucun produit trouvé pour "{query}".
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {products.map(({ node }) => (
              <Link
                key={node.id}
                to={`/product/${node.slug}`}
                className="bg-white rounded overflow-hidden hover:shadow-lg"
              >
                <img
                  src={node.thumbnail?.url || "https://via.placeholder.com/300"}
                  alt={node.name}
                  className="h-[10rem] w-full object-cover"
                />
                <div className="p-2">
                  <h3 className="text-sm">{node.name.length > 40 ? node.name.slice(0, 40) + "..." : node.name}</h3>
                  <p className="font-bold text-primary-font-color mt-1">
                    FCFA {node.pricing?.priceRange?.start?.gross?.amount?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">{node.category?.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </PageContainerPosition>
    </div>
  );
};