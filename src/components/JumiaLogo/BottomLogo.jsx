import React from "react";
import ImageLogo from "../../assets/images/logo.png";

export const BottomLogo = () => {
	return (
		<div className="py-0">
			<img
				src={ImageLogo}
				alt="Flash Shop"
				className="w-[10rem] h-[10rem] mt-0 object-contain"
			/>
		</div>
	);
};
