import React from "react";
import { useQuery } from "@apollo/client";
import { GET_CATEGORY_BY_SLUG } from "../../apollo/queries";
import { AddsSalesTitle } from "../AddsSalesTitle";
import AddsTopTitleDescription from "../AddsTopTitleDescription";
import { Icon } from "@iconify/react";
import { Button } from "../Button";
import { ImagesSlidesAddsList } from "../SlidesImagesFlashDescription/ImagesSlidesAddsList";
import { CHANNEL_ID } from "../../config/constants";

export const ClearanceSalesAdd = () => {
	const { data, loading, error } = useQuery(GET_CATEGORY_BY_SLUG, {
		variables: { slug: "electronique", channel: CHANNEL_ID, first: 8 },
	});

	const products = data?.category?.products?.edges?.map(({ node }, index) => ({
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
				<AddsTopTitleDescription className="bg-primary-color-page text-primary-font-color align-middle font-normal text-[1.2rem] capitalise">
					<div className="flex items-center text-40">
						<span className="ml-2">Clearance Sale - Électronique</span>
					</div>

					<Button className="uppercase font-light">
						See All
						<Icon icon="material-symbols:chevron-right-rounded" height="25" />
					</Button>
				</AddsTopTitleDescription>

				{loading && <p className="p-4">Loading clearance products...</p>}
				{error && <p className="p-4 text-red-500">Error loading clearance products.</p>}
				{!loading && <ImagesSlidesAddsList images={products} />}
			</AddsSalesTitle>
		</div>
	);
};
