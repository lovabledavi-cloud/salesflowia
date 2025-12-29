import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/Logo";
import { Mail, Lock, User, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

const signupSchema = loginSchema.extend({
  fullName: z.string().trim().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", fullName: "" },
  });

  useEffect(() => {
    if (!loading && user) {
      navigate("/admin");
    }
  }, [user, loading, navigate]);

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Erro ao entrar",
        description: error.message === "Invalid login credentials" 
          ? "Email ou senha incorretos" 
          : error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Bem-vindo!", description: "Login realizado com sucesso." });
      navigate("/admin");
    }
  };

  const onSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password, data.fullName);
    setIsLoading(false);

    if (error) {
      let message = error.message;
      if (error.message.includes("already registered")) {
        message = "Este email já está cadastrado. Tente fazer login.";
      }
      toast({
        title: "Erro ao cadastrar",
        description: message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Conta criada!", description: "Você já pode acessar o painel." });
      navigate("/admin");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald/10 rounded-full blur-[120px]" />
      </div>

      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <Logo size="lg" />
            <h1 className="text-2xl font-bold text-foreground mt-6">
              {isLogin ? "Acesse o Painel" : "Criar Conta"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLogin ? "Entre com suas credenciais" : "Preencha os dados para criar sua conta"}
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 md:p-8 shadow-2xl">
            {isLogin ? (
              <Form {...loginForm} key="login-form">
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="email"
                              placeholder="seu@email.com"
                              className="pl-10 bg-background/50 border-border/50 focus:border-emerald h-12"
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="pl-10 bg-background/50 border-border/50 focus:border-emerald h-12"
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-emerald to-emerald-dark hover:opacity-90 text-white font-semibold"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...signupForm} key="signup-form">
                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-5">
                  <FormField
                    control={signupForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              placeholder="Seu nome"
                              className="pl-10 bg-background/50 border-border/50 focus:border-emerald h-12"
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="email"
                              placeholder="seu@email.com"
                              className="pl-10 bg-background/50 border-border/50 focus:border-emerald h-12"
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="pl-10 bg-background/50 border-border/50 focus:border-emerald h-12"
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-emerald to-emerald-dark hover:opacity-90 text-white font-semibold"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Criar Conta"
                    )}
                  </Button>
                </form>
              </Form>
            )}

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isLogin ? (
                  <>Não tem conta? <span className="text-emerald font-medium">Cadastre-se</span></>
                ) : (
                  <>Já tem conta? <span className="text-emerald font-medium">Faça login</span></>
                )}
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Voltar para o site
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default Auth;
