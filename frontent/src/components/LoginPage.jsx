import React, { useState } from "react";
import { loginStyles } from "../assests/dummyStyles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, Clapperboard, Eye, EyeOff, Popcorn, File } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/auth";

const LoginPage = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // handle submit
  const handleSubmit = async (e) => {

    e.preventDefault()
    setIsLoading(true)

    if (!formData.password || formData.password.length < 8) {
      toast.error("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    try {

      const payload = {
        email: formData.email.trim(),
        password: formData.password
      }

      const res = await axios.post(`${API_BASE}/login`, payload)

      const data = res.data

      if (data && data.success) {

        toast.success(data.message || "Login successful")

        if (data.token) {
          localStorage.setItem("token", data.token)
        }

        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user))
        }

        setTimeout(() => {
          navigate("/")
        }, 1200)

      } else {
        toast.error(data?.message || "Login failed")
      }

    }
    catch (err) {

      console.error("Login error:", err)

      const serverMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Server error"

      toast.error(serverMsg)

    }
    finally {
      setIsLoading(false)
    }
  }

  const goBack = () => {
    navigate("/")
  }

  return (
    <div className={loginStyles.pageContainer}>
      <ToastContainer theme="dark" />

      <div className="relative w-full max-w-md z-10 ">

        <div className={loginStyles.backButtonContainer}>
          <button onClick={goBack} className={loginStyles.backButton}>
            <ArrowLeft size={20} className={loginStyles.backButtonIcon} />
            <span className={loginStyles.backButtonText}>Back to Home</span>
          </button>
        </div>

        <div className={loginStyles.cardContainer}>
          <div className={loginStyles.cardHeader}></div>

          <div className={loginStyles.cardContent}>

            <div className={loginStyles.headerContainer}>
              <div className={loginStyles.headerIconContainer}>
                <File className={loginStyles.headerIcon} size={28} />
                <h2 className={loginStyles.headerTitle}>Cinema Access</h2>
              </div>

              <p className={loginStyles.headerSubtitle}>
                Enter your credentials to continue the experience
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Email */}

              <div className={loginStyles.inputGroup}>
                <label htmlFor="email" className={loginStyles.label}>
                  Email
                </label>

                <div className={loginStyles.inputContainer}>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder=""
                  />

                  <Clapperboard size={16} className="text-red-500" />
                </div>
              </div>

              {/* Password */}

              <div className={loginStyles.inputGroup}>
                <label htmlFor="password" className={loginStyles.label}>
                  Password
                </label>

                <div className={loginStyles.inputWithIcon}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="your password"
                  />

                  <button
                    type="button"
                    className={loginStyles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {
                      showPassword
                        ? <EyeOff size={18} className={loginStyles.passwordToggleIcon} />
                        : <Eye size={18} className={loginStyles.passwordToggleIcon} />
                    }
                  </button>

                </div>
              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={isLoading}
                className={`${loginStyles.submitButton} ${
                  isLoading ? loginStyles.submitButtonDisabled : ""
                }`}
              >

                {
                  isLoading ? (

                    <div className={loginStyles.buttonContent}>
                      <div className={loginStyles.loadingSpinner}></div>
                      <span className={loginStyles.buttonText}>
                        SIGNING IN...
                      </span>
                    </div>

                  ) : (

                    <div className={loginStyles.buttonContent}>
                      <Popcorn size={18} className={loginStyles.buttonIcon} />
                      <span className={loginStyles.buttonText}>
                        ACCESS YOUR ACCOUNT
                      </span>
                    </div>

                  )
                }

              </button>

            </form>

          </div>
        </div>

        <div className={loginStyles.footerContainer}>
          <p className={loginStyles.footerText}>
            Don't have an account?{" "}
            <a href="/signup" className={loginStyles.footerLink}>
              Create one now
            </a>
          </p>
        </div>

      </div>

      <style jsx>{loginStyles.customCSS}</style>
    </div>
  )
}

export default LoginPage