import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../../apollo/queries";
import { AddsSalesTitle } from "../AddsSalesTitle";
import AddsTopTitleDescription from "../AddsTopTitleDescription";
import { Icon } from "@iconify/react";
import { Button } from "../Button";
import { CountdownTimer } from "../CountdownTimer";
import { ImagesSlidesAddsList } from "../SlidesImagesFlashDescription/ImagesSlidesAddsList";
import { CHANNEL_ID } from "../../config/constants";

function FlashSalesSliderAdd() {
  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    variables: { first: 8, channel: CHANNEL_ID },
  });

  // Transform Saleor data to match your existing ImagesSlidesAddsList format
  const products = data?.products?.edges?.map(({ node }, index) => ({
    id: index,
    image: node.thumbnail?.url || "",
    name: node.name,
    price: `FCFA ${node.pricing?.priceRange?.start?.gross?.amount?.toLocaleString()}`,
    cost: `FCFA ${node.pricing?.priceRange?.stop?.gross?.amount?.toLocaleString()}`,
  })) || [];

  return (
    <div className="w-full mt-4 border-rounded rounded bg-primary-page-color">
      <AddsSalesTitle>
        <AddsTopTitleDescription className="bg-danger-add-color text-white align-middle font-normal text-[1.2rem]">
          <div className="flex items-center">
            <Icon icon="ion:pricetags-sharp" color="#f90" height="25" />
            <span className="ml-2">Flash Sales</span>
          </div>
          <div className="flex">
            Time Left: <CountdownTimer />
          </div>
          <Button className="uppercase font-light">
            See All
            <Icon icon="material-symbols:chevron-right-rounded" height="25" />
          </Button>
        </AddsTopTitleDescription>

        {loading && <p className="p-4">Loading products...</p>}
        {error && <p className="p-4 text-red-500">Error loading products.</p>}
        {!loading && <ImagesSlidesAddsList images={products} />}
      </AddsSalesTitle>
    </div>
  );
}

export default FlashSalesSliderAdd;