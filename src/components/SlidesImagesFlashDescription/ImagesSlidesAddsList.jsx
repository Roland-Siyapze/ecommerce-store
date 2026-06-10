import React from "react";

export const ImagesSlidesAddsList = ({ images }) => {
	return (
		<div className="grid grid-cols-6 gap-2">
			{images.map((image) => {
				return (
					<div
						key={image.id}
						className="bg-primary-page-color w-full mt-2 rounded justify-center overflow-hidden hover:shadow-lg cursor-pointer"
					>
						<img
							src={image.image}
							alt="Option"
							className="h-[10rem] w-full mt-0 object-cover pl-3"
						/>
						<div className="p-3">
							<h3 className="text-sm">
								{image.name.length > 20
									? image.name.slice(0, 20) + "..."
									: image.name}
							</h3>

							<h1>{image.price}</h1>
							<p className="line-through text-xs text-gray-text-color font-bold">
								{image.cost}
							</p>
						</div>
						<button className="w-[90%] bg-[#0A1174] text-white rounded py-1 text-sm m-2">
							Buy
						</button>
					</div>
				);
			})}
		</div>
	);
};
