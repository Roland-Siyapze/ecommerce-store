import React from "react";
import { Button } from "../Button";
import { CardBoarder } from "../CardBoarder";
import { Icon } from "@iconify/react";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "../../apollo/queries";
import { Link } from "react-router-dom";

const categoryIcons = {
  "montres-bijoux": "mdi:watch",
  "parfums-mode": "mdi:spray",
  "deco-literie": "mdi:sofa",
  "sante-beaute": "map:beauty-salon",
  "telephones-tablettes": "ph:device-tablet",
  "electronique": "mdi:television-speaker",
  "electromenager": "openmoji:drip-coffee-maker",
  "promotions": "ion:pricetags-sharp",
  default: "mdi:more-circle-outline",
};

export const CategoryNavigationMenu = () => {
  const { data, loading } = useQuery(GET_CATEGORIES, {
    variables: { first: 12, level: 0 },
  });

  const categories = data?.categories?.edges || [];

  if (loading) return <CardBoarder className="bg-primary-page-color w-1/5" />;

  return (
    <CardBoarder className="bg-primary-page-color w-1/5">
      {categories.map(({ node }) => (
        <Link key={node.id} to={`/category/${node.slug}`}>
          <Button primary className="text-primary-font-color text-xs pt-1 w-full">
            <Icon
              icon={categoryIcons[node.slug] || categoryIcons.default}
              color="#313133"
              height="20"
              className="mx-[4px]"
            />
            {node.name}
          </Button>
        </Link>
      ))}
    </CardBoarder>
  );
};