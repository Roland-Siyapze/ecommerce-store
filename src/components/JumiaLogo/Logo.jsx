import React from "react";
import ImageLogo from "../../assets/images/logo.png";
export const Logo = () => {
	return (
		<div className="py-0">
			<img
				src={ImageLogo}
				alt="Jumia Logo"
				className="w-[10rem] h-[8rem] mt-0"
			/>
		</div>
	);
};
