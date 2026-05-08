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

  // RENDER BACKEND URL
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
    try {
      const res = await fetch(
        `${BASE_URL}/products`
      );

      const data = await res.json();

      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  // SIGNUP
  const handleSignup = async () => {
    const res = await fetch(
      `${BASE_URL}/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      }
    );

    const data = await res.json();

    alert(data.message);

    if (
      data.message ===
      "Signup successful"
    ) {
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
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      }
    );

    const data = await res.json();

    alert(data.message);

    if (
      data.message ===
      "Login successful"
    ) {
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
      (item) =>
        item._id === product._id
    );

    if (existingProduct) {
      const updatedCart = cart.map(
        (item) =>
          item._id === product._id
            ? {
                ...item,
                quantity:
                  item.quantity + 1
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
    const updatedCart = cart.map(
      (item) =>
        item._id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1
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
              quantity:
                item.quantity - 1
            }
          : item
      )
      .filter(
        (item) => item.quantity > 0
      );

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
          "Content-Type":
            "application/json"
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
      total +
      item.price * item.quantity,
    0
  );

  // LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent:
            "center",
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
              setUsername(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "15px",
              borderRadius: "10px",
              border:
                "1px solid #ccc"
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "20px",
              borderRadius: "10px",
              border:
                "1px solid #ccc"
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
              backgroundColor:
                "#111827",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "17px",
              cursor: "pointer"
            }}
          >
            {isLogin
              ? "Login"
              : "Signup"}
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

  // MAIN WEBSITE
  return (
    <div
      style={{
        backgroundColor: "#f3f4f6",
        minHeight: "100vh"
      }}
    >
      {/* ADMIN BAR */}

      {role === "admin" && (
        <div
          style={{
            backgroundColor:
              "#facc15",
            padding: "12px",
            textAlign: "center",
            fontWeight: "bold"
          }}
        >
          👑 Admin Access Enabled
        </div>
      )}

      {/* NAVBAR */}

      <div
        style={{
          backgroundColor: "#111827",
          padding: "18px 35px",
          display: "flex",
          justifyContent:
            "space-between",
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
          <span>
            🛒 {cart.length}
          </span>

          <span>
            ₹ {totalPrice}
          </span>

          <button
            onClick={() =>
              setShowProfile(
                !showProfile
              )
            }
            style={{
              backgroundColor:
                "white",
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer"
            }}
          >
            👤
          </button>

          {/* PROFILE */}

          {showProfile && (
            <div
              style={{
                position: "absolute",
                top: "65px",
                right: "0",
                width: "250px",
                backgroundColor:
                  "white",
                borderRadius: "15px",
                padding: "20px",
                boxShadow:
                  "0 5px 20px rgba(0,0,0,0.2)"
              }}
            >
              <h2>
                👋 Welcome
              </h2>

              <p>
                <strong>
                  Username:
                </strong>{" "}
                {username}
              </p>

              <p>
                <strong>
                  Role:
                </strong>{" "}
                {role}
              </p>

              <p>
                <strong>
                  Cart Items:
                </strong>{" "}
                {cart.length}
              </p>

              <button
                onClick={
                  handleLogout
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor:
                    "#111827",
                  color: "white",
                  border: "none",
                  borderRadius:
                    "10px",
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

      {/* PRODUCTS */}

      <div
        style={{
          padding: "35px"
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "35px",
            fontSize: "48px"
          }}
        >
          Explore Products ✨
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(270px, 1fr))",
            gap: "25px"
          }}
        >
          {products.map(
            (product) => {
              const cartItem =
                cart.find(
                  (item) =>
                    item._id ===
                    product._id
                );

              return (
                <div
                  key={
                    product._id
                  }
                  style={{
                    backgroundColor:
                      "white",
                    borderRadius:
                      "18px",
                    overflow:
                      "hidden",
                    boxShadow:
                      "0 5px 20px rgba(0,0,0,0.08)"
                  }}
                >
                  <img
                    src={
                      product.image
                    }
                    alt={
                      product.title
                    }
                    style={{
                      width: "100%",
                      height:
                        "220px",
                      objectFit:
                        "cover"
                    }}
                  />

                  <div
                    style={{
                      padding:
                        "20px",
                      textAlign:
                        "center"
                    }}
                  >
                    <h2>
                      {
                        product.title
                      }
                    </h2>

                    <h2
                      style={{
                        color:
                          "green"
                      }}
                    >
                      ₹{" "}
                      {
                        product.price
                      }
                    </h2>

                    <p>
                      {
                        product.description
                      }
                    </p>

                    {!cartItem ? (
                      <button
                        onClick={() =>
                          addToCart(
                            product
                          )
                        }
                        style={{
                          width:
                            "100%",
                          padding:
                            "12px",
                          backgroundColor:
                            "#111827",
                          color:
                            "white",
                          border:
                            "none",
                          borderRadius:
                            "10px",
                          cursor:
                            "pointer"
                        }}
                      >
                        Add To Cart
                      </button>
                    ) : (
                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "center",
                          alignItems:
                            "center",
                          gap: "18px",
                          marginTop:
                            "15px"
                        }}
                      >
                        <button
                          onClick={() =>
                            decreaseQuantity(
                              product._id
                            )
                          }
                        >
                          ➖
                        </button>

                        <span>
                          {
                            cartItem.quantity
                          }
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(
                              product._id
                            )
                          }
                        >
                          ➕
                        </button>
                      </div>
                    )}

                    {/* ADMIN */}

                    {role ===
                      "admin" && (
                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "center",
                          gap: "10px",
                          marginTop:
                            "15px"
                        }}
                      >
                        <button
                          style={{
                            backgroundColor:
                              "#2563eb",
                            color:
                              "white",
                            border:
                              "none",
                            padding:
                              "10px 15px",
                            borderRadius:
                              "8px"
                          }}
                        >
                          Update
                        </button>

                        <button
                          style={{
                            backgroundColor:
                              "#dc2626",
                            color:
                              "white",
                            border:
                              "none",
                            padding:
                              "10px 15px",
                            borderRadius:
                              "8px"
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* CART */}

        <div
          style={{
            marginTop: "70px"
          }}
        >
          <h1
            style={{
              textAlign: "center",
              marginBottom: "30px",
              fontSize: "42px"
            }}
          >
            🛒 Your Cart
          </h1>

          {cart.length === 0 ? (
            <div
              style={{
                backgroundColor:
                  "white",
                padding: "40px",
                borderRadius:
                  "15px",
                textAlign:
                  "center"
              }}
            >
              Your cart is empty 😔
            </div>
          ) : (
            <>
              <div
                style={{
                  backgroundColor:
                    "white",
                  borderRadius:
                    "20px",
                  overflow:
                    "hidden"
                }}
              >
                <div
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "2fr 1fr 1fr 1fr",
                    backgroundColor:
                      "#111827",
                    color:
                      "white",
                    padding: "18px",
                    fontWeight:
                      "bold"
                  }}
                >
                  <div>
                    Product
                  </div>
                  <div>
                    Price
                  </div>
                  <div>
                    Quantity
                  </div>
                  <div>
                    Action
                  </div>
                </div>

                {cart.map((item) => (
                  <div
                    key={
                      item._id
                    }
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "2fr 1fr 1fr 1fr",
                      padding:
                        "22px",
                      alignItems:
                        "center",
                      borderBottom:
                        "1px solid #eee"
                    }}
                  >
                    <div>
                      {
                        item.title
                      }
                    </div>

                    <div
                      style={{
                        color:
                          "green",
                        fontWeight:
                          "bold"
                      }}
                    >
                      ₹{" "}
                      {
                        item.price
                      }
                    </div>

                    <div>
                      {
                        item.quantity
                      }
                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(
                          item._id
                        )
                      }
                      style={{
                        backgroundColor:
                          "#ef4444",
                        color:
                          "white",
                        border:
                          "none",
                        padding:
                          "10px 15px",
                        borderRadius:
                          "10px",
                        cursor:
                          "pointer",
                        width:
                          "100px"
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* TOTAL */}

              <div
                style={{
                  marginTop: "30px",
                  backgroundColor:
                    "white",
                  padding: "30px",
                  borderRadius:
                    "20px",
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center"
                }}
              >
                <h1>
                  Total Amount
                </h1>

                <h1
                  style={{
                    color:
                      "green"
                  }}
                >
                  ₹ {totalPrice}
                </h1>
              </div>

              {/* CHECKOUT */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "center",
                  marginTop: "25px"
                }}
              >
                <button
                  onClick={
                    handleCheckout
                  }
                  style={{
                    backgroundColor:
                      "green",
                    color:
                      "white",
                    border:
                      "none",
                    padding:
                      "15px 30px",
                    borderRadius:
                      "12px",
                    fontSize:
                      "18px",
                    cursor:
                      "pointer"
                  }}
                >
                  Proceed To Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;