import React from "react";
import { Check, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HeaderLanding } from "../../Member/pages/Header";

export const PricingPage = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Basic",
      price: "$10",
      period: "/month",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 2 projects",
        "5 team members",
        "Supports attachments of Image and PDFs file",
        "Basic task management",
        "Email support",
      ],
      popular: false,
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      price: "$20",
      period: "/month",
      description: "Best for growing teams and businesses",
      features: [
        "Up to 8 projects",
        "25 team members",
        "Supports attachments of images, PDFs, and DOC file",
        "Priority email support",
        "Custom workflows",
      ],
      popular: true,
      buttonText: "Upgrade to Pro",
    },
    {
      name: "Enterprise",
      price: "$50",
      period: "/month",
      description: "For large organizations with advanced needs",
      features: [
        "Unlimited projects",
        "Unlimited team members",
        "Attach all type files",
        "Advanced security & compliance",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 phone support",
        "Advanced analytics",
      ],
      popular: false,
      buttonText: "Upgrade to Enterprise",
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <HeaderLanding />

      {/* HERO */}
      <div className="relative px-6 md:px-20 py-24">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1600&auto=format&fit=crop"
            alt="background"
            className="w-full h-full object-cover opacity-5"
          />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-100 mb-6">
            <Crown size={18} className="text-cyan-600" />

            <span className="text-sm font-medium text-cyan-700">
              Flexible Pricing Plans
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
            Simple Pricing for
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              {" "}
              Every Team
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Choose the perfect plan for your collaboration workflow. Scale from
            startups to enterprise organizations.
          </p>
        </div>
      </div>

      {/* PRICING CARDS */}
      <div className="px-6 md:px-20 pb-24">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl border transition-all duration-500 overflow-hidden hover:-translate-y-2 ${
                plan.popular
                  ? "border-cyan-500 shadow-2xl scale-105"
                  : "border-gray-200 shadow-xl"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-5 right-5">
                  <div className="bg-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    MOST POPULAR
                  </div>
                </div>
              )}

              {/* Background */}
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1200&auto=format&fit=crop"
                  alt="pricing background"
                  className="w-full h-full object-cover opacity-5"
                />
              </div>

              {/* Content */}
              <div className="relative z-10 p-10 bg-white/90 backdrop-blur-sm h-full flex flex-col">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {plan.name}
                  </h2>

                  <p className="mt-3 text-gray-600">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mt-8 flex items-end gap-2">
                    <span className="text-6xl font-bold text-gray-900">
                      {plan.price}
                    </span>

                    <span className="text-gray-500 mb-2 text-lg">
                      {plan.period}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gray-200 my-8"></div>

                  {/* Features */}
                  <div className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check
                            size={14}
                            className="text-cyan-600"
                          />
                        </div>

                        <span className="text-gray-700 leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Button */}
                <div className="mt-10">
                  <button
                    onClick={() => navigate("/signup")}
                    className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 ${
                      plan.popular
                        ? "bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="px-6 md:px-20 pb-24">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 p-12 text-center shadow-2xl">
          <h2 className="text-4xl font-bold text-white">
            Need Custom Enterprise Solutions?
          </h2>

          <p className="text-cyan-100 mt-4 text-lg max-w-2xl mx-auto">
            Contact our team for custom integrations, advanced security,
            onboarding support, and scalable infrastructure.
          </p>

         <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
  
  {/* Contact Sales */}
   <button
  onClick={() => {
    window.open(
      "https://mail.google.com/mail/?view=cm&fs=1&to=afsalkp4343@gmail.com",
      "_blank"
    );
  }}
  className="px-8 py-4 rounded-2xl bg-white text-cyan-600 font-semibold hover:bg-gray-100 transition shadow-lg"
>
  Contact Sales
</button>

  {/* WhatsApp */}
  <a
    href="https://wa.me/9074784343"
    target="_blank"
    rel="noopener noreferrer"
    className="px-8 py-4 rounded-2xl bg-green-500 text-white font-semibold hover:bg-green-400 transition shadow-lg"
  >
    Connect Through WhatsApp
  </a>

</div>
        </div>
      </div>
    </div>
  );
};