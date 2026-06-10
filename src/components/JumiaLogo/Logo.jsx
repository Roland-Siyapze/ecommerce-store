import React from "react";
import ImageLogo from "../../assets/images/logoh.png";
export const Logo = () => {
	return (
		<div className="py-4">
			<img
				src={ImageLogo}
				alt="Jumia Logo"
				className="w-[10rem] h-[3rem] mt-0"
			/>
		</div>
	);
};
