import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../apollo/queries";
import { Link } from "react-router-dom";
import { PageContainerPosition } from "../components/PageContainerPosition";

const boutiqueNames = {
  orimo: "Orimo",
  roch: "Roch",
  oscar: "Oscar",
};

export const BoutiquePage = () => {
  const { slug } = useParams();
  const boutiqueName = boutiqueNames[slug] || slug;

  const { data, loading } = useQuery(GET_PRODUCTS, {
    variables: {
      first: 24,
      channel: "default-channel",
      filter: { search: boutiqueName },
    },
  });

  const products = data?.products?.edges || [];

  return (
    <div className="bg-primary-bg-page min-h-screen py-6">
      <PageContainerPosition>
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-2">Boutique {boutiqueName}</h1>
          <p className="text-gray-500 text-sm mb-6">
            Tous les produits de la marque {boutiqueName}
          </p>

          {loading && <p className="text-center py-10">Chargement...</p>}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {products.map(({ node }) => (
              <Link key={node.id} to={`/product/${node.slug}`}
                className="bg-white rounded overflow-hidden hover:shadow-lg">
                <img src={node.thumbnail?.url || "https://via.placeholder.com/300"}
                  alt={node.name} className="h-[10rem] w-full object-cover" />
                <div className="p-2">
                  <h3 className="text-sm">{node.name.length > 40 ? node.name.slice(0, 40) + "..." : node.name}</h3>
                  <p className="font-bold mt-1">
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