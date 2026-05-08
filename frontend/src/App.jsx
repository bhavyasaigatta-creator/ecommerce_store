import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [role, setRole] = useState("");

  const [showProfile, setShowProfile] =
    useState(false);

  // BASE URL
  const BASE_URL =
    "https://ecommerce-store-r6uf.onrender.com";

  // LOAD CART
  useEffect(() => {
    const savedCart =
      localStorage.getItem("cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // SAVE CART
  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  // FETCH PRODUCTS
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch(
      `${BASE_URL}/products`
    );

    const data = await res.json();

    setProducts(data);
  };

  // SIGNUP
  const handleSignup = async () => {
    const res = await fetch(
      `${BASE_URL}/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      }
    );

    const data = await res.json();

    alert(data.message);

    if (data.message === "Signup successful") {
      setIsLogin(true);
    }
  };

  // LOGIN
  const handleLogin = async () => {
    const res = await fetch(
      `${BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      }
    );

    const data = await res.json();

    alert(data.message);

    if (data.message === "Login successful") {
      setIsLoggedIn(true);

      setRole(data.role);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    setIsLoggedIn(false);

    setShowProfile(false);
  };

  // ADD TO CART
  const addToCart = (product) => {
    const existingProduct = cart.find(
      (item) => item._id === product._id
    );

    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item._id === product._id
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      );

      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1
        }
      ]);
    }
  };

  // INCREASE
  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id
        ? {
            ...item,
            quantity: item.quantity + 1
          }
        : item
    );

    setCart(updatedCart);
  };

  // DECREASE
  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity - 1
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
  };

  // REMOVE
  const removeFromCart = (id) => {
    const updatedCart = cart.filter(
      (item) => item._id !== id
    );

    setCart(updatedCart);
  };

  // CHECKOUT
  const handleCheckout = async () => {
    const res = await fetch(
      `${BASE_URL}/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          items: cart,
          totalAmount: totalPrice
        })
      }
    );

    const data = await res.json();

    alert(data.message);

    setCart([]);
  };

  // TOTAL
  const totalPrice = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  // LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background:
            "linear-gradient(to right, #141e30, #243b55)"
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "20px",
            width: "350px",
            boxShadow:
              "0 5px 25px rgba(0,0,0,0.3)"
          }}
        >
          <h1
            style={{
              textAlign: "center",
              marginBottom: "30px",
              color: "#111827",
              fontSize: "42px"
            }}
          >
            {isLogin
              ? "Welcome Back 👋"
              : "Create Account ✨"}
          </h1>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "15px",
              borderRadius: "10px",
              border: "1px solid #ccc"
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "20px",
              borderRadius: "10px",
              border: "1px solid #ccc"
            }}
          />

          <button
            onClick={
              isLogin
                ? handleLogin
                : handleSignup
            }
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "#111827",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "17px",
              cursor: "pointer"
            }}
          >
            {isLogin ? "Login" : "Signup"}
          </button>

          <p
            style={{
              marginTop: "20px",
              textAlign: "center",
              cursor: "pointer"
            }}
            onClick={() =>
              setIsLogin(!isLogin)
            }
          >
            {isLogin
              ? "New user? Signup"
              : "Already have account? Login"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#f3f4f6",
        minHeight: "100vh"
      }}
    >
      {role === "admin" && (
        <div
          style={{
            backgroundColor: "#facc15",
            padding: "12px",
            textAlign: "center",
            fontWeight: "bold"
          }}
        >
          👑 Admin Access Enabled
        </div>
      )}

      <div
        style={{
          backgroundColor: "#111827",
          padding: "18px 35px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "32px"
          }}
        >
          🛍️ ShopVerse
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "25px",
            color: "white",
            position: "relative"
          }}
        >
          <span>🛒 {cart.length}</span>

          <span>₹ {totalPrice}</span>

          <button
            onClick={() =>
              setShowProfile(!showProfile)
            }
            style={{
              backgroundColor: "white",
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer"
            }}
          >
            👤
          </button>

          {showProfile && (
            <div
              style={{
                position: "absolute",
                top: "65px",
                right: "0",
                width: "250px",
                backgroundColor: "white",
                borderRadius: "15px",
                padding: "20px",
                boxShadow:
                  "0 5px 20px rgba(0,0,0,0.2)"
              }}
            >
              <h2>👋 Welcome</h2>

              <p>
                <strong>Username:</strong>{" "}
                {username}
              </p>

              <p>
                <strong>Role:</strong>{" "}
                {role}
              </p>

              <p>
                <strong>Cart Items:</strong>{" "}
                {cart.length}
              </p>

              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#111827",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  marginTop: "10px",
                  cursor: "pointer"
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;