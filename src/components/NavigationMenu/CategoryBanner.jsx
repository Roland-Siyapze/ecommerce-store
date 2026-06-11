import React, { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "../../apollo/queries";
import { Icon } from "@iconify/react";

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

export const CategoryBanner = () => {
  const { data } = useQuery(GET_CATEGORIES, {
    variables: { first: 20, level: 0 },
  });
  const scrollRef = useRef(null);

  const categories = data?.categories?.edges || [];

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#0A1174] shadow-md relative">
      <div className="max-w-6xl mx-auto flex items-center">
        {/* Left scroll button */}
        {/* <button
          onClick={() => scroll(-1)}
          className="flex-shrink-0 text-white px-2 hover:text-secondary-text-color transition"
        >
          <Icon icon="mdi:chevron-left" height="20" />
        </button> */}

        {/* Scrollable categories */}
        <div
          ref={scrollRef}
          className="flex items-center overflow-x-auto scrollbar-hide gap-1 py-2 flex-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map(({ node }) => (
            <Link
              key={node.id}
              to={`/category/${node.slug}`}
              className="flex items-center gap-1.5 flex-shrink-0 px-3 py-1.5 rounded text-white text-xs font-medium hover:bg-white hover:text-[#0A1174] transition-all duration-200 group whitespace-nowrap"
            >
              <Icon
                icon={categoryIcons[node.slug] || categoryIcons.default}
                height="16"
                className="flex-shrink-0"
              />
              <span>{node.name}</span>
            </Link>
          ))}
        </div>

        {/* Right scroll button */}
        {/* <button
          onClick={() => scroll(1)}
          className="flex-shrink-0 text-white px-2 hover:text-secondary-text-color transition"
        >
          <Icon icon="mdi:chevron-right" height="20" />
        </button> */}
      </div>
    </div>
  );
};