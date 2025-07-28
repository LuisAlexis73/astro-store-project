import { itemsInCart } from "@/store/cart.store";
import { CartCookiesClient } from "@/utils/cart-cookies";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";

export const CartCounter = () => {
  const $itemsInCart = useStore(itemsInCart);

  useEffect(() => {
    const cart = CartCookiesClient.getCart();
    itemsInCart.set(cart.length);
  }, []);

  return (
    <a href="/cart" className="relative inline-block">
      {$itemsInCart > 0 && (
        <span
          className="absolute -top-2 -right-2 flex justify-center items-center
        bg-blue-500 text-white text-xs rounded-full w-5 h-5"
        >
          {$itemsInCart}
        </span>
      )}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 50 50"
      >
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            stroke="#344054"
            strokeWidth="3"
            d="M35.417 42.708h.208m-12.708 0h.208z"
          />
          <path
            stroke="#306cfe"
            strokeWidth="2"
            d="M6.25 6.25h4.833a2.08 2.08 0 0 1 1.938 1.313l7.812 19.52l-2.666 5.313a2.084 2.084 0 0 0 1.875 3.02h19.541"
          />
          <path
            stroke="#306cfe"
            strokeWidth="2"
            d="M15 12.5h28.75l-5.833 14.583H20.833"
          />
        </g>
      </svg>
    </a>
  );
};
