import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, MessageCircle, Sparkles, Users, ArrowRight, Bot } from "lucide-react";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";

const formSchema = z.object({
  name: z.string().trim().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }).max(100),
  email: z.string().trim().email({ message: "Email inválido" }).max(255),
  whatsapp: z.string().trim().min(10, { message: "WhatsApp deve ter pelo menos 10 dígitos" }).max(15),
});

type FormData = z.infer<typeof formSchema>;

const benefits = [
  { icon: Bot, text: "Demonstração personalizada do sistema" },
  { icon: MessageCircle, text: "Suporte direto via WhatsApp" },
  { icon: Users, text: "Consultoria gratuita para seu negócio" },
  { icon: Sparkles, text: "Acesso antecipado a novidades" },
];

const Captura = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Form submitted:", data);
    
    setIsLoading(false);
    setIsSubmitted(true);
    
    toast({
      title: "Cadastro realizado!",
      description: "Em breve entraremos em contato com você.",
    });
  };

  const formatWhatsApp = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, "");
    // Limit to 11 digits
    return digits.slice(0, 11);
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "1s" }} />
      </div>

      {/* Header */}
      <header className="py-4 px-4 md:px-8 bg-background/80 backdrop-blur-sm border-b border-border/50 relative z-10">
        <div className="container flex items-center justify-center">
          <Logo size="lg" />
        </div>
      </header>

      <div className="container relative z-10 py-12 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald/10 border border-emerald/20 text-emerald text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" />
                Agende sua Demonstração Gratuita
              </motion.div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                Veja na prática como{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald to-violet">
                  triplicar suas vendas
                </span>{" "}
                com IA
              </h1>

              <p className="text-lg text-muted-foreground mb-8">
                Agende uma demonstração exclusiva e descubra como o SalesFlow.IA pode transformar seu negócio em uma máquina de vendas automatizada.
              </p>

              {/* Benefits */}
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald/10 border border-emerald/20 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-emerald" />
                    </div>
                    <span className="text-foreground">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right side - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 md:p-8 shadow-2xl">
                {!isSubmitted ? (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        Preencha seus dados
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Entraremos em contato em até 24h
                      </p>
                    </div>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome completo</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Seu nome"
                                  className="bg-background/50 border-border/50 focus:border-emerald h-12"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>E-mail</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="seu@email.com"
                                  className="bg-background/50 border-border/50 focus:border-emerald h-12"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="whatsapp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>WhatsApp</FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="11999999999"
                                  className="bg-background/50 border-border/50 focus:border-emerald h-12"
                                  {...field}
                                  onChange={(e) => field.onChange(formatWhatsApp(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-12 bg-gradient-to-r from-emerald to-emerald-dark hover:opacity-90 text-white font-semibold text-base rounded-xl shadow-lg shadow-emerald/25"
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Enviando...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              Quero minha demonstração
                              <ArrowRight className="w-5 h-5" />
                            </span>
                          )}
                        </Button>
                      </form>
                    </Form>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Ao se cadastrar, você concorda com nossa política de privacidade.
                    </p>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Cadastro realizado!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Em breve nossa equipe entrará em contato pelo WhatsApp para agendar sua demonstração.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = "/"}
                      className="border-border/50"
                    >
                      Voltar para o site
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Captura;
