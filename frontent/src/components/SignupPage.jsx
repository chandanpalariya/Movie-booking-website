import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { signUpStyles } from '../assests/dummyStyles'; 
import {
  ArrowLeft,
  Ticket,
  User,
  Clapperboard,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Film,
} from 'lucide-react';
import axios from "axios"

const API_BASE= "http://localhost:5000/api/auth"

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    birthDate: '', // Standardized to match state key
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target; // Fixed destructuring
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear error for this field on change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form
  const validateForm =  () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required';
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      // Note: This is a simple age check; for precision, consider months/days
      if (age < 13) {
        newErrors.birthDate = 'You must be at least 13 years old';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Go back function
  const goBack = () => {
    window.history.back();
  };

  // Handle form submission
  const handleSubmit =  async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    // Log masked form data (for debugging; avoid in production)
    console.log('Form data:', {
      ...formData,
      password: '***' + formData.password.slice(-2), // Mask all but last 2 chars
    });

    setIsLoading(true);

    try{
      const payload={
       fullName: formData.fullName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        birthDate: formData.birthDate,
        password: formData.password,
      }

      const response=await axios.post(`${API_BASE}/register`,payload,{
        headers:{"Content-Type":"application/json"}
      })

      if(response.data && response.data.success ){
        toast.success("Account Created Succesfully! Redirecting to Login...")

        if(response.data.token){
          localStorage.setItem("token",response.data.token)
        }

        if(response.data.user){
          localStorage.setItem("user",JSON.stringify(response.data.user));
        }

        setTimeout(()=>{
          window.location.href="/login";

        },1200)

      }
        else{
          toast.error(response.data?.message || "Registration failed")
        }
      }

        

      catch (err) {
      console.error("Registration error:", err);
      // If backend returned an error message, try to map it to a field
      const serverMsg =
        err?.response?.data?.message || err?.message || "Server error";

      // Map common backend messages to the form fields
      if (serverMsg.toLowerCase().includes("email")) {
        setErrors((prev) => ({ ...prev, email: serverMsg }));
      } else if (serverMsg.toLowerCase().includes("username")) {
        setErrors((prev) => ({ ...prev, username: serverMsg }));
      } else if (serverMsg.toLowerCase().includes("phone")) {
        setErrors((prev) => ({ ...prev, phone: serverMsg }));
      } else {
        toast.error(serverMsg);
      }
    } 

    finally{
      setIsLoading(false)
    }
  };

  // Particles setup (moved to useEffect to avoid SSR issues)
  useEffect(() => {
    // If particles need dynamic setup, handle here. For now, static.
  }, []);

  return (
    <div className={signUpStyles.container}>
      <div className={signUpStyles.particlesContainer}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={signUpStyles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className={signUpStyles.gradientOrbs}>
        <div className={signUpStyles.orb1} />
        <div className={signUpStyles.orb2} />
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className={signUpStyles.mainContent}>
        <button onClick={goBack} className={signUpStyles.backButton}>
          <ArrowLeft size={20} className={signUpStyles.backIcon} />
          <span className={signUpStyles.backText}>Back to Home</span>
        </button>

        <div className={signUpStyles.card}>
          <div className={signUpStyles.cardHeader} />
          <div className={signUpStyles.cardContent}>
            <div className={signUpStyles.header}>
              <div className={signUpStyles.headerFlex}>
                <Ticket className={signUpStyles.headerIcon} size={32} />
                <h2 className={signUpStyles.headerTitle}>Join our cinema</h2>
              </div>
              <p className={signUpStyles.headerSubtitle}>
                Create your Account and start your cinematic journey
              </p>
            </div>

            <form onSubmit={handleSubmit}> {/* Fixed onSubmit */}
              <div className={signUpStyles.formGrid}>
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className={signUpStyles.field}>
                    Full Name
                  </label>
                  <div className={signUpStyles.inputContainer}>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`${signUpStyles.input.base} ${
                        errors.fullName ? signUpStyles.input.error : signUpStyles.input.normal
                      } ${signUpStyles.inputWithIcon}`}
                      placeholder="Enter your full name"
                      required
                      aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    />
                    <div className={signUpStyles.inputIcon} aria-label="User icon">
                      <User size={18} />
                    </div>
                  </div>
                  {errors.fullName && (
                    <p id="fullName-error" className={signUpStyles.errorText}>
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <label htmlFor="username" className={signUpStyles.field}>
                    Username
                  </label>
                  <div className={signUpStyles.inputContainer}>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`${signUpStyles.input.base} ${
                        errors.username ? signUpStyles.input.error : signUpStyles.input.normal
                      } ${signUpStyles.inputWithIcon}`}
                      placeholder="Choose a username"
                      required
                      aria-describedby={errors.username ? 'username-error' : undefined}
                    />
                    <div className={signUpStyles.inputIcon} aria-label="Clapperboard icon">
                      <Clapperboard size={18} />
                    </div>
                  </div>
                  {errors.username && (
                    <p id="username-error" className={signUpStyles.errorText}>
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className={signUpStyles.field}>
                    Email Address
                  </label>
                  <div className={signUpStyles.inputContainer}>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`${signUpStyles.input.base} ${
                        errors.email ? signUpStyles.input.error : signUpStyles.input.normal
                      } ${signUpStyles.inputWithIcon}`}
                      placeholder="Enter your email"
                      required
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    <div className={signUpStyles.inputIcon} aria-label="Mail icon">
                      <Mail size={18} />
                    </div>
                  </div>
                  {errors.email && (
                    <p id="email-error" className={signUpStyles.errorText}>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className={signUpStyles.field}>
                    Phone Number
                  </label>
                  <div className={signUpStyles.inputContainer}>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`${signUpStyles.input.base} ${
                        errors.phone ? signUpStyles.input.error : signUpStyles.input.normal
                      } ${signUpStyles.inputWithIcon}`}
                      placeholder="+1 (555) 123-4567"
                      required
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                    <div className={signUpStyles.inputIcon} aria-label="Phone icon">
                      <Phone size={18} />
                    </div>
                  </div>
                  {errors.phone && (
                    <p id="phone-error" className={signUpStyles.errorText}>
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Birth Date */}
                <div>
                  <label htmlFor="birthDate" className={signUpStyles.field}>
                    Date of Birth
                  </label>
                  <div className={signUpStyles.inputContainer}>
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      className={`${signUpStyles.input.base} ${
                        errors.birthDate ? signUpStyles.input.error : signUpStyles.input.normal
                      } ${signUpStyles.inputWithIcon}`}
                      required
                      aria-describedby={errors.birthDate ? 'birthDate-error' : undefined}
                    />
                    <div className={signUpStyles.inputIcon} aria-label="Film icon">
                      <Film size={18} /> {/* Changed from Phone for theme */}
                    </div>
                  </div>
                  {errors.birthDate && (
                    <p id="birthDate-error" className={signUpStyles.errorText}>
                      {errors.birthDate}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className={signUpStyles.field}>
                    Password
                  </label>
                  <div className={signUpStyles.inputContainer}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`${signUpStyles.input.base} ${
                        errors.password ? signUpStyles.input.error : signUpStyles.input.normal
                      } ${signUpStyles.inputWithIcon}`}
                      placeholder="Create a strong password"
                      required
                      aria-describedby={errors.password ? 'password-error' : undefined}
                    />
                    <div className={signUpStyles.inputIcon} aria-label="Lock icon">
                      <Lock size={18} />
                    </div>
                    <button
                      type="button"
                      className={signUpStyles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff size={18} className={signUpStyles.toggleIcon} />
                      ) : (
                        <Eye size={18} className={signUpStyles.toggleIcon} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="password-error" className={signUpStyles.errorText}>
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className={signUpStyles.submitContainer}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`${signUpStyles.submitButton.base} ${
                    isLoading ? signUpStyles.submitButton.loading : ''
                  }`}
                >
                  {isLoading ? (
                    <div className={signUpStyles.submitContent}>
                      <div className={signUpStyles.loadingSpinner} />
                      Creating Your Account
                    </div>
                  ) : (
                    <div className={signUpStyles.submitContent}>
                      <Film size={20} className={signUpStyles.submitIcon} />
                      <span>Create Cinema Account</span>
                    </div>
                  )}
                </button>
              </div>
            </form>

            <div className={signUpStyles.loginContainer}>
              <p className={signUpStyles.loginText}>
                Already have an account?{' '}
                <a href="/login" className={signUpStyles.loginLink}>
                  Sign in to your Account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;