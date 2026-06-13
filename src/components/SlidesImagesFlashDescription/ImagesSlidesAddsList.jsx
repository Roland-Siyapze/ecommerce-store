import React from "react";
import { Link } from "react-router-dom";

export const ImagesSlidesAddsList = ({ images }) => {
	return (
		<div className="grid grid-cols-6 gap-2">
			{images.map((image) => {
				return (
					<Link
						to={`/product/${image.slug}`}
						key={image.id}
						className="bg-primary-page-color w-full mt-2 rounded justify-center overflow-hidden hover:shadow-lg cursor-pointer flex flex-col h-full"
					>
						<img
							src={image.image}
							alt="Option"
							className="h-[10rem] w-full mt-0 object-cover pl-3"
						/>
						<div className="p-3 flex-grow">
							<h3 className="text-sm">
								{image.name.length > 20
									? image.name.slice(0, 20) + "..."
									: image.name}
							</h3>

							<h1>{image.price}</h1>
							<p className="line-through text-xs text-gray-text-color font-bold h-4">
								{image.cost}
							</p>
						</div>
						<div className="mt-auto">
							<button className="w-[90%] bg-[#0A1174] text-white rounded py-1 text-sm m-2 hover:bg-[#080d58]">
								Buy
							</button>
						</div>
					</Link>
				);
			})}
		</div>
	);
};
