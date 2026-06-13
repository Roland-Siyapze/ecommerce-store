import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../apollo/queries";
import { Link } from "react-router-dom";
import { PageContainerPosition } from "../components/PageContainerPosition";
import { CHANNEL_ID } from "../config/constants";

export const PromotionsPage = () => {
  const { data, loading } = useQuery(GET_PRODUCTS, {
    variables: { first: 24, channel: CHANNEL_ID },
  });

  const products = data?.products?.edges || [];

  return (
    <div className="bg-primary-bg-page min-h-screen py-6">
      <PageContainerPosition>
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-6">Promotions & Offres Spéciales</h1>

          {loading && <p className="text-center py-10">Chargement...</p>}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {products.map(({ node }) => (
              <Link key={node.id} to={`/product/${node.slug}`}
                className="bg-white rounded overflow-hidden hover:shadow-lg">
                <img src={node.thumbnail?.url || "https://via.placeholder.com/300"}
                  alt={node.name} className="h-[10rem] w-full object-cover" />
                <div className="p-2">
                  <h3 className="text-sm">{node.name.length > 40 ? node.name.slice(0, 40) + "..." : node.name}</h3>
                  <p className="font-bold text-secondary-text-color mt-1">
                    FCFA {node.pricing?.priceRange?.start?.gross?.amount?.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </PageContainerPosition>
    </div>
  );
};