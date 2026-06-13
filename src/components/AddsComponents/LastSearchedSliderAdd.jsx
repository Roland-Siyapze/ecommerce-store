import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../../apollo/queries";
import { AddsSalesTitle } from "../AddsSalesTitle";
import AddsTopTitleDescription from "../AddsTopTitleDescription";
import { ImagesSlidesAddsList } from "../SlidesImagesFlashDescription/ImagesSlidesAddsList";
import { Icon } from "@iconify/react";
import { Button } from "../Button";
import { CHANNEL_ID } from "../../config/constants";

export const LastSearchedSliderAdd = () => {
	const { data, loading, error } = useQuery(GET_PRODUCTS, {
		variables: { first: 8, channel: CHANNEL_ID },
	});

	const products = data?.products?.edges?.map(({ node }, index) => ({
		id: node.id || index,
		slug: node.slug,
		image: node.thumbnail?.url || "",
		name: node.name,
		price: node.pricing?.priceRange?.start?.gross?.amount ? `FCFA ${node.pricing.priceRange.start.gross.amount.toLocaleString()}` : 'FCFA 0',
		cost: node.pricing?.priceRange?.stop?.gross?.amount ? `FCFA ${node.pricing.priceRange.stop.gross.amount.toLocaleString()}` : '',
	})) || [];

	return (
		<div className="w-full mt-4 border-rounded rounded bg-primary-page-color ">
			<AddsSalesTitle>
				<AddsTopTitleDescription className="text-black align-middle font-normal text-[1.2rem] capitalise">
					<div className="flex items-center text-40">
						<span className="ml-2">Recently Added Products</span>
					</div>

					<Button className="uppercase font-light text-secondary-text-color">
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
};
