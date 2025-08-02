"use client"

import { useState } from "react"
import { X, Check, Users, Shield, Zap } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"

export const Suscription = (props:any) => {
  
  const [isOpen, setIsOpen] = useState(true)

  const plans = [
    {
      name: "Basic",
      price: "₹599",
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
      price: "₹999",
      period: "/month",
      description: "Best for growing teams and businesses",
      features: [
        "Up to 15 projects",
        "30 team members",
        "Supports attachments of images, PDFs, and DOC file",
        "Priority email support",
        "Custom workflows",
      ],
      popular: true,
      buttonText: "Start Free Trial",
    },
    {
      name: "Enterprise",
      price: "₹1,599",
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
      buttonText: "Contact Sales",
    },
  ]

const handleClose = () =>{
    setIsOpen(false)
    props.isOpen()
}

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Choose Your Plan</h2>
            <p className="text-muted-foreground">Upgrade your project management experience</p>
          </div>
          <Button variant="ghost" size="icon" onClick={ handleClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">Most Popular</Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </CardContent>

                <CardFooter>
                  <Button
                    className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-6 pt-6 border-t">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1">Team Collaboration</h3>
              <p className="text-sm text-muted-foreground">Work together seamlessly with real-time updates</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-3">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1">Powerful Features</h3>
              <p className="text-sm text-muted-foreground">Advanced tools to boost your productivity</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-3">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-1">Secure & Reliable</h3>
              <p className="text-sm text-muted-foreground">Enterprise-grade security for your data</p>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>All plans include a 14-day free trial. No credit card required.</p>
            <p className="mt-1">Cancel anytime. Upgrade or downgrade as needed.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
