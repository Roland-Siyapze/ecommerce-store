import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES, GET_CATEGORY_BY_SLUG } from "../../apollo/queries";
import { Icon } from "@iconify/react";
import { CardBoarder } from "../CardBoarder";
import { CHANNEL_ID } from "../../config/constants";

const categoryIcons = {
  "montres-bijoux": "mdi:watch",
  "parfums-mode": "mdi:spray-bottle",
  "deco-literie": "mdi:sofa-outline",
  "sante-beaute": "mdi:face-woman-shimmer-outline",
  "telephones-tablettes": "ph:device-tablet",
  "electronique": "mdi:television-play",
  "electromenager": "mdi:blender-outline",
  "promotions": "ion:pricetags-sharp",
  default: "mdi:tag-outline",
};

// ── Full tree for HomePage ──
const FullCategoryTree = () => {
  const [openSlugs, setOpenSlugs] = useState({});

  const { data, loading } = useQuery(GET_CATEGORIES, {
    variables: { first: 20, level: 0 },
  });

  const categories = data?.categories?.edges || [];

  if (loading) {
    return (
      <CardBoarder className="bg-primary-page-color w-1/5 p-0 my-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-8 mx-3 my-1 bg-gray-100 rounded animate-pulse" />
        ))}
      </CardBoarder>
    );
  }

  const toggle = (slug) =>
    setOpenSlugs((prev) => ({ ...prev, [slug]: !prev[slug] }));

  return (
    <CardBoarder className="bg-primary-page-color w-1/5 p-0 my-3 overflow-hidden">
      {categories.map(({ node: parent }) => {
        const subcategories = parent.children?.edges || [];
        const isOpen = openSlugs[parent.slug] !== false; // open by default

        return (
          <div key={parent.id}>
            {/* Top-level category row */}
            <div
              className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-100 cursor-pointer hover:bg-orange-50 group"
              onClick={() => toggle(parent.slug)}
            >
              <Link
                to={`/category/${parent.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 flex-1 text-xs font-semibold text-primary-font-color group-hover:text-secondary-text-color"
              >
                <Icon
                  icon={categoryIcons[parent.slug] || categoryIcons.default}
                  height="16"
                  className="flex-shrink-0 text-[#0A1174]"
                />
                <span className="uppercase tracking-wide">{parent.name}</span>
              </Link>
              {subcategories.length > 0 && (
                <Icon
                  icon={isOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
                  height="14"
                  className="text-gray-400 flex-shrink-0"
                />
              )}
            </div>

            {/* Subcategories */}
            {isOpen && subcategories.length > 0 && (
              <div className="bg-gray-50 border-b border-gray-100">
                {subcategories.map(({ node: sub }) => {
                  const grandchildren = sub.children?.edges || [];
                  const subIsOpen = openSlugs[sub.slug] !== false;

                  return (
                    <div key={sub.id}>
                      {/* Subcategory row */}
                      <div
                        className="flex items-center justify-between pl-6 pr-3 py-1.5 cursor-pointer hover:bg-orange-50 group"
                        onClick={() => grandchildren.length > 0 && toggle(sub.slug)}
                      >
                        <Link
                          to={`/category/${parent.slug}/${sub.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 flex-1 text-xs text-gray-600 group-hover:text-secondary-text-color"
                        >
                          <Icon
                            icon="mdi:chevron-right"
                            height="12"
                            className="text-gray-300 flex-shrink-0"
                          />
                          {sub.name}
                        </Link>
                        {grandchildren.length > 0 && (
                          <Icon
                            icon={subIsOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
                            height="12"
                            className="text-gray-300 flex-shrink-0"
                          />
                        )}
                      </div>

                      {/* Grandchildren (3rd level) */}
                      {subIsOpen && grandchildren.length > 0 && (
                        <div className="bg-white">
                          {grandchildren.map(({ node: grand }) => (
                            <Link
                              key={grand.id}
                              to={`/category/${sub.slug}/${grand.slug}`}
                              className="flex items-center gap-2 pl-10 pr-3 py-1.5 text-xs text-gray-500 hover:bg-orange-50 hover:text-secondary-text-color transition"
                            >
                              <Icon
                                icon="mdi:minus"
                                height="10"
                                className="text-gray-300 flex-shrink-0"
                              />
                              {grand.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </CardBoarder>
  );
};

// ── Subcategory sidebar for CategoryPage ──
const SubCategoryMenu = ({ activeSlug }) => {
  const { data, loading } = useQuery(GET_CATEGORY_BY_SLUG, {
    variables: { slug: activeSlug, channel: CHANNEL_ID, first: 50 },
  });

  const category = data?.category;
  const subcategories = category?.children?.edges || [];

  if (loading) return <div className="w-48 flex-shrink-0" />;
  if (subcategories.length === 0) return null;

  return (
    <div className="bg-white w-48 flex-shrink-0 shadow-sm rounded overflow-hidden">
      <div className="bg-[#0A1174] text-white px-3 py-2 text-sm font-bold">
        {category?.name}
      </div>
      <div className="py-1">
        {subcategories.map(({ node }) => (
          <Link
            key={node.id}
            to={`/category/${activeSlug}/${node.slug}`}
            className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-orange-50 hover:text-secondary-text-color transition group"
          >
            <Icon
              icon={categoryIcons[node.slug] || categoryIcons.default}
              height="14"
              className="text-gray-400 group-hover:text-secondary-text-color flex-shrink-0"
            />
            <span>{node.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

// ── Smart wrapper ──
export const CategoryNavigationMenu = () => {
  const { slug, parentSlug } = useParams();
  const activeSlug = slug || parentSlug;

  if (!activeSlug) {
    return <FullCategoryTree />;
  }

  return <SubCategoryMenu activeSlug={activeSlug} />;
};