import { Input } from "../InputTypeCategory/Input";
import React, { useState } from "react";
import { Logo } from "../JumiaLogo/Logo";
import { PageContainerPosition } from "../PageContainerPosition";
import { Icon } from "@iconify/react";
import { Button } from "../Button";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export const PrimeNavbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div id="navbar" className="bg-primary-page-color shadow-lg py-1">
      <PageContainerPosition>
        <Link to="/"><Logo /></Link>
        <div className="flex items-center">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <Icon icon="ic:baseline-search" color="#75757A" height="20" />
            </span>
            <Input
              inputType="text"
              placeholder="Rechercher produits, marques et catégories"
              className="w-[33rem] pl-7"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button search onClick={handleSearch}
            className="shadow-lg uppercase border rounded-[5px]">
            Rechercher
          </Button>
          <Button primary className="pl-2">
            <Icon icon="clarity:avatar-line" color="#313133" height="26" className="mr-[4px]" />
            Compte
            <Icon icon="material-symbols:keyboard-arrow-down-rounded" color="#313133" height="20" className="mx-[4px]" />
          </Button>
          <Button primary>
            <Icon icon="material-symbols:help-outline" color="#313133" height="26" className="mx-[4px]" />
            Aide
          </Button>
          <Link to="/cart">
            <Button primary className="relative">
              <Icon icon="ic:outline-shopping-cart" color="#313133" height="26" className="mx-[4px]" />
              Panier
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary-text-color text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </PageContainerPosition>
    </div>
  );
};