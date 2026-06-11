import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CATEGORY_BY_SLUG } from "../apollo/queries";
import { PageContainerPosition } from "../components/PageContainerPosition";

export const CategoryPage = () => {
  const { slug, parentSlug } = useParams();
  const activeSlug = slug || parentSlug;

  const { data, loading, error } = useQuery(GET_CATEGORY_BY_SLUG, {
    variables: { slug: activeSlug, channel: "default-channel", first: 24 },
  });

  if (loading) return (
    <div className="flex justify-center py-20">
      <p className="text-lg">Chargement...</p>
    </div>
  );

  if (error) return (
    <div className="flex justify-center py-20">
      <p className="text-red-500">Erreur de chargement.</p>
    </div>
  );

  const category = data?.category;
  const products = category?.products?.edges || [];
  const subcategories = category?.children?.edges || [];
  const breadcrumbs = category?.ancestors?.edges || [];

  return (
    <div className="bg-primary-bg-page min-h-screen">
      <PageContainerPosition>
        <div className="w-full py-4">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-4 gap-1">
            <Link to="/" className="hover:text-secondary-text-color">Accueil</Link>
            {breadcrumbs.map(({ node }) => (
              <span key={node.id} className="flex items-center gap-1">
                <span>/</span>
                <Link to={`/category/${node.slug}`} className="hover:text-secondary-text-color">
                  {node.name}
                </Link>
              </span>
            ))}
            <span>/</span>
            <span className="text-primary-font-color font-medium">{category?.name}</span>
          </div>

          {/* Category Header */}
          <h1 className="text-2xl font-bold text-primary-font-color mb-4">
            {category?.name}
          </h1>

          {/* Subcategories */}
          {subcategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {subcategories.map(({ node }) => (
                <Link
                  key={node.id}
                  to={`/category/${activeSlug}/${node.slug}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-secondary-text-color hover:text-secondary-text-color transition"
                >
                  {node.name}
                </Link>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              Aucun produit dans cette catégorie pour l'instant.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {products.map(({ node }) => (
                <Link
                  key={node.id}
                  to={`/product/${node.slug}`}
                  className="bg-white rounded overflow-hidden hover:shadow-lg cursor-pointer"
                >
                  <img
                    src={node.thumbnail?.url || "https://via.placeholder.com/300"}
                    alt={node.name}
                    className="h-[10rem] w-full object-cover"
                  />
                  <div className="p-2">
                    <h3 className="text-sm text-gray-700">
                      {node.name.length > 40 ? node.name.slice(0, 40) + "..." : node.name}
                    </h3>
                    <p className="font-bold text-primary-font-color mt-1">
                      FCFA {node.pricing?.priceRange?.start?.gross?.amount?.toLocaleString()}
                    </p>
                    {node.pricing?.discount && (
                      <p className="line-through text-xs text-gray-400">
                        FCFA {node.pricing?.priceRange?.stop?.gross?.amount?.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <button className="w-[90%] bg-[#0A1174] text-white rounded py-1 text-sm m-2">
                    Voir le produit
                  </button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </PageContainerPosition>
    </div>
  );
};