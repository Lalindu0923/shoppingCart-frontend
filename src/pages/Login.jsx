import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff, Mail, Lock, User, Chrome, Facebook } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

const AuthComponent = () => {
  // ------------------ State hooks ------------------
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  // ------------------ Facebook SDK Loader ------------------
useEffect(() => {
  // Load Facebook SDK
  window.fbAsyncInit = function() {
    window.FB.init({
      appId: '1295551428430076', // Your Facebook App ID
      cookie: true,
      xfbml: true,
      version: 'v19.0' // ← Change to v19.0 or newer
    });
    console.log('Facebook SDK initialized');
  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}, []);

  // ------------------ Facebook Login Handler ------------------
  const handleFacebookLogin = () => {
    if (!window.FB) {
      alert("Facebook SDK not loaded yet. Please wait a moment and try again.");
      return;
    }

    window.FB.login(function(response) {
      if (response.authResponse) {
        // User logged in successfully
        console.log('Facebook Login Successful:', response);
        
        // Get user profile info
        window.FB.api('/me', { fields: 'name,email,picture' }, function(profileResponse) {
          console.log('Facebook Profile:', profileResponse);
          
          const userProfile = {
            name: profileResponse.name,
            email: profileResponse.email,
            picture: profileResponse.picture?.data?.url,
            provider: "facebook",
            accessToken: response.authResponse.accessToken,
            userID: profileResponse.id
          };

          // Save to localStorage
          localStorage.setItem("user", JSON.stringify(userProfile));

          // Send to backend
          handleFacebookBackendLogin(userProfile);
        });
        
      } else {
        console.log('User cancelled login or did not fully authorize.');
        alert("Facebook login was cancelled.");
      }
    }, { scope: 'public_profile,email' });
  };

const handleFacebookBackendLogin = async (profile) => {
  try {
    // 🔹 Try logging in first
    const backendRes = await axios.post("http://localhost:5000/api/v1/customer/login", {
      name: profile.name,
      email: profile.email,
      provider: "facebook",
      password: "facebook_oauth",
    });

    console.log("Facebook user login success:", backendRes.data);
    localStorage.setItem("user", JSON.stringify(backendRes.data.user));
    alert("Facebook login successful ✅");
    navigate("/"); // Go to homepage

  } catch (loginErr) {
    // 🔹 If login fails, check if it’s because user doesn’t exist (401)
    if (loginErr.response?.status === 401) {
      try {
        // 🔹 Register the user
        const registerRes = await axios.post("http://localhost:5000/api/v1/customer/register", {
          name: profile.name,
          email: profile.email,
          provider: "facebook",
          password: "facebook_oauth",
        });

        console.log("Facebook user registered:", registerRes.data);
        localStorage.setItem("user", JSON.stringify(registerRes.data.data));
        alert("Facebook registration successful ✅");
        navigate("/"); // Go to homepage

      } catch (registerErr) {
        console.error("Facebook registration failed:", registerErr.response?.data || registerErr.message);
        alert("Facebook registration failed ❌");
      }
    } else {
      console.log("Login error:", loginErr.response?.data || loginErr.message);
      alert("Facebook login failed ❌");
    }
  }
};


  // ------------------ Input handling ------------------
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ------------------ Google Login ------------------
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        
        const profile = await res.json();
        console.log("Google Profile:", profile);

        localStorage.setItem("user", JSON.stringify(profile));

        try {
          await axios.post("http://localhost:5000/api/v1/customer/login", {
            name: profile.name,
            email: profile.email,
            provider: "google",
            password: "google_oauth",
          });
          console.log("Existing user login successful");
        } catch (loginErr) {
          console.log("Login error:", loginErr.response?.data || loginErr.message);
        }

        navigate("/");

      } catch (err) {
        console.error("Google login error:", err);
        alert("Google login failed ❌");
      }
    },
    onError: () => {
      alert("Google login popup failed ❌");
    },
  });

  const handleSocialLogin = (provider) => {
    if (provider === "Google") {
      googleLogin();
    } else if (provider === "Facebook") {
      handleFacebookLogin();
    }
  };

  // ------------------ Form submit ------------------
  const handleSubmit = async () => {
    if (isLogin) {
      try {
        const res = await axios.post("http://localhost:5000/api/v1/customer/login", {
          email: formData.email,
          password: formData.password,
        });

        console.log("Login success:", res.data);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert("Login successful ✅");
        navigate("/");

      } catch (err) {
        console.error("Login failed:", err.response?.data || err.message);
        alert("Login failed ❌");
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        return alert("Passwords do not match!");
      }

      try {
        const res = await axios.post("http://localhost:5000/api/v1/customer/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          provider: "local",
        });

        console.log("Register success:", res.data);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert("Registration successful ✅");
        setIsLogin(true);

      } catch (err) {
        console.error("Register failed:", err.response?.data || err.message);
        alert("Registration failed ❌ " + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-black to-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-600">{isLogin ? "Sign in to your account" : "Join us today"}</p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                isLogin ? "bg-white text-yellow-500 shadow-sm" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                !isLogin ? "bg-white text-yellow-500 shadow-sm" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <div className="p-6 m-4 bg-amber-200/50 space-y-4 mb-6 rounded-lg shadow-lg">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  required={!isLogin}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-green-600 to-green-400 text-white py-3 rounded-xl font-medium hover:from-green-700 hover:to-green-700 transition-all duration-600 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button
              onClick={() => handleSocialLogin("Google")}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
            >
              <Chrome className="w-5 h-5 text-red-500" />
              <span className="text-gray-700 font-medium">Continue with Google</span>
            </button>

            <button
              onClick={() => handleSocialLogin("Facebook")}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
            >
              <Facebook className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700 font-medium">Continue with Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;