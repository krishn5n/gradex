"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Shield, ArrowRight, User, Users, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function AuthPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)

      if (selectedRole) {
        toast({
          title: "Login successful",
          description: `Welcome back! You are logged in as ${selectedRole}`,
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Please select a role",
          description: "You need to select a role to continue",
          variant: "destructive",
        })
      }
    }, 1500)
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Account created",
        description: "Your account has been created successfully",
      })
      router.push("/dashboard")
    }, 3000)
  }

  const roleCards = [
    {
      id: "student",
      title: "Student",
      description: "Access exams, view results, and track your progress",
      icon: User,
      color: "bg-blue-500",
    },
    {
      id: "faculty",
      title: "Faculty",
      description: "Create exams, manage question banks, and view student results",
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      id: "admin",
      title: "Administrator",
      description: "Manage users, monitor exams, and access system analytics",
      icon: Users,
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[url('/grid.svg')] bg-contain">
      <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" />

      <div className="container relative z-10 flex flex-col items-center justify-center space-y-6 px-4 py-8 md:px-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="flex items-center justify-center rounded-full bg-primary p-2"
          >
            <Shield className="h-10 w-10 text-primary-foreground" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">AsifDraft3</h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              A secure, AI-powered examination management system
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login to your account</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Button variant="link" className="h-auto p-0 text-xs">
                        Forgot password?
                      </Button>
                    </div>
                    <Input id="password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label>Select your role</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {roleCards.map((role) => (
                        <motion.div
                          key={role.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedRole(role.id)}
                          className={`cursor-pointer rounded-lg border p-2 text-center transition-colors ${
                            selectedRole === role.id
                              ? "border-primary bg-primary/10"
                              : "hover:border-muted-foreground/20"
                          }`}
                        >
                          <div
                            className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full ${role.color}`}
                          >
                            <role.icon className="h-4 w-4 text-white" />
                          </div>
                          <p className="text-xs font-medium">{role.title}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                        <span>Logging in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span>Login</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>Enter your information to create an account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First name</Label>
                      <Input id="first-name" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last name</Label>
                      <Input id="last-name" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label>Select your role</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {roleCards.map((role) => (
                        <motion.div
                          key={role.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedRole(role.id)}
                          className={`cursor-pointer rounded-lg border p-2 text-center transition-colors ${
                            selectedRole === role.id
                              ? "border-primary bg-primary/10"
                              : "hover:border-muted-foreground/20"
                          }`}
                        >
                          <div
                            className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full ${role.color}`}
                          >
                            <role.icon className="h-4 w-4 text-white" />
                          </div>
                          <p className="text-xs font-medium">{role.title}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleSignup} disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span>Create account</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

