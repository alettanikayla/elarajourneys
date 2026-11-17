// Example usage of the refactored FAQ block. The real page uses src/components/site/faq-section.tsx.
import Faqs02 from "@/components/ui/faqs-02";

export default function Faqs02Demo() {
  return (
    <Faqs02
      title="Your questions answered"
      intro="Quick answers from our team."
      items={[{ q: "What is included?", a: "Hotel, transport, tickets and guide." }]}
      contact={{ title: "Talk to a human", reply: "Replies in < 1 h", cta: "Chat on WhatsApp", href: "https://wa.me/6281234567890", emailLabel: "Or email", email: "hello@elarajourneys.com" }}
    />
  );
}
