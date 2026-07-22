import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // KEY GIỎ HÀNG THEO USER
  // =========================
  const getCartKey = () => {
    if (!user?.id) {
      return null;
    }

    return `cart_${user.id}`;
  };

  // =========================
  // LOAD GIỎ HÀNG CỦA USER
  // =========================
  useEffect(() => {
    if (authLoading) {
      return;
    }

    loadCart();
  }, [user, authLoading]);

  const loadCart = async () => {
    try {
      setLoading(true);

      // Nếu chưa đăng nhập thì giỏ hàng rỗng
      if (!user?.id) {
        setCartItems([]);
        return;
      }

      const cartKey = `cart_${user.id}`;

      const savedCart = await AsyncStorage.getItem(cartKey);

      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.log("Lỗi tải giỏ hàng:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LƯU GIỎ HÀNG
  // =========================
  useEffect(() => {
    if (
      authLoading ||
      loading ||
      !user?.id
    ) {
      return;
    }

    const saveCart = async () => {
      try {
        const cartKey = `cart_${user.id}`;

        await AsyncStorage.setItem(
          cartKey,
          JSON.stringify(cartItems)
        );
      } catch (error) {
        console.log(
          "Lỗi lưu giỏ hàng:",
          error
        );
      }
    };

    saveCart();
  }, [
    cartItems,
    user,
    authLoading,
    loading,
  ]);

  // =========================
  // THÊM VÀO GIỎ HÀNG
  // =========================
  const addToCart = (product, variant) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) =>
          item.productId === product._id &&
          item.variantId === variant._id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.productId === product._id &&
          item.variantId === variant._id
            ? {
                ...item,
                quantity:
                  item.quantity < item.stock
                    ? item.quantity + 1
                    : item.quantity,
              }
            : item
        );
      }

      const newItem = {
        productId: product._id,
        variantId: variant._id,

        name: product.name,

        colorName: variant.colorName,
        colorCode: variant.colorCode,

        size: variant.size,

        price:
          product.discountPrice > 0
            ? product.discountPrice
            : product.price,

        image:
          variant.image ||
          product.image,

        quantity: 1,

        stock: variant.stock,
      };

      return [
        ...currentItems,
        newItem,
      ];
    });
  };

  // =========================
  // XÓA SẢN PHẨM
  // =========================
  const removeFromCart = (
    productId,
    variantId
  ) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.variantId === variantId
          )
      )
    );
  };

  // =========================
  // TĂNG SỐ LƯỢNG
  // =========================
  const increaseQuantity = (
    productId,
    variantId
  ) => {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (
          item.productId === productId &&
          item.variantId === variantId
        ) {
          if (
            item.quantity >= item.stock
          ) {
            return item;
          }

          return {
            ...item,
            quantity:
              item.quantity + 1,
          };
        }

        return item;
      })
    );
  };

  // =========================
  // GIẢM SỐ LƯỢNG
  // =========================
  const decreaseQuantity = (
    productId,
    variantId
  ) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) => {
          if (
            item.productId === productId &&
            item.variantId === variantId
          ) {
            return {
              ...item,
              quantity:
                item.quantity - 1,
            };
          }

          return item;
        })
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  // =========================
  // XÓA TOÀN BỘ GIỎ HÀNG
  // =========================
  const clearCart = async () => {
    setCartItems([]);

    if (user?.id) {
      await AsyncStorage.removeItem(
        `cart_${user.id}`
      );
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}