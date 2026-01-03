import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Preciso entender de tecnologia para usar o sistema?",
    answer: "Não! O sistema foi criado para donos de depósito, não para técnicos. A instalação é feita pela nossa equipe e você só precisa saber usar WhatsApp. Em 15 minutos você aprende tudo."
  },
  {
    question: "A IA realmente atende igual um humano?",
    answer: "A IA foi treinada especificamente para o mercado de gás. Ela entende gírias, responde dúvidas sobre preços, prazos, formas de pagamento e até negocia com clientes. Mais de 90% dos clientes não percebem que é uma IA."
  },
  {
    question: "Como funciona a garantia de 90 dias?",
    answer: "Simples: se você aplicar nosso protocolo de vendas e não lucrar R$ 2.000 extras em 90 dias, devolvemos seu dinheiro E você fica com o sistema. Zero risco para você."
  },
  {
    question: "Funciona para depósitos pequenos?",
    answer: "Sim! Na verdade, depósitos menores têm ainda mais vantagem porque a IA substitui a necessidade de contratar atendentes. Temos clientes que vendem 50 botijões por mês até 500+."
  },
  {
    question: "E se eu já tiver um sistema de gestão?",
    answer: "O SalesFlow se integra com os principais sistemas do mercado. E mesmo que não tenha integração direta, nosso dashboard é completo e pode funcionar de forma independente."
  },
  {
    question: "Quantas mensagens a IA pode enviar por dia?",
    answer: "Não há limite! A IA pode atender milhares de conversas simultâneas. Diferente de um funcionário, ela nunca se cansa, não pede aumento e trabalha 24 horas."
  },
  {
    question: "Posso personalizar as respostas da IA?",
    answer: "Totalmente! Você define os preços, horários de entrega, formas de pagamento, promoções e até o jeito que a IA fala. Ela pode ser mais formal ou mais descontraída."
  },
  {
    question: "O que são as vagas de fundador?",
    answer: "É uma condição especial para os primeiros 50 clientes. Você paga uma única vez e não tem mensalidade por 6 meses. Depois, o valor mensal será bem abaixo do mercado. É nosso jeito de agradecer quem acredita no projeto desde o início."
  }
];

const FAQSection = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet/10 rounded-full blur-[150px]" />
      
      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-violet text-violet text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Dúvidas Frequentes
          </span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            <span className="text-gradient-white">Perguntas </span>
            <span className="text-gradient-violet">Frequentes</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Tire suas dúvidas sobre o SalesFlowIA
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-2xl glass-card border-gradient px-6 data-[state=open]:bg-violet/5 transition-all duration-300"
              >
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-violet transition-colors py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;