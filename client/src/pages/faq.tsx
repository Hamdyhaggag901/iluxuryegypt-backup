import { useQuery } from "@tanstack/react-query";
import { useSEO } from "@/hooks/use-seo";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircle, Phone, Mail, Loader2, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import NewsletterSection from "../components/newsletter-section";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sortOrder: number;
  isVisible: boolean;
}

export default function FAQPage() {
  // Enhanced SEO for Luxury Travel Context
  useSEO({
    title: "Egypt Travel Guide & FAQs | Planning Your Luxury Journey",
    description: "Expert answers to your questions about luxury Egypt tours, visa requirements, best time to visit, and bespoke concierge services.",
  });

  const { data, isLoading } = useQuery<{ success: boolean; faqs: FAQ[] }>({
    queryKey: ["/api/public/faqs"],
    queryFn: async () => {
      const res = await fetch("/api/public/faqs");
      return res.json();
    },
  });

  const faqs = data?.faqs || [];

  const groupedFaqs = faqs.reduce((acc, faq) => {
    const category = faq.category || "General Information";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  const categories = Object.keys(groupedFaqs);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <meta name="keywords" content="Egypt Travel FAQ, Luxury Egypt Tours Planning, Egypt Visa Info, Private Tours Cairo FAQ, Nile Cruise Questions" />
      </Helmet>
      
      <Navigation />

      {/* Hero Section - Refined with Brand Aesthetics */}
      <section className="relative pt-48 pb-32 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/gold-dust.png')]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-accent uppercase tracking-[0.3em] text-sm font-bold mb-4 block animate-fade-in">
            Concierge Support
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
            How Can We Assist You?
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
            Everything you need to know about embarking on an extraordinary journey through the land of the Pharaohs.
          </p>
        </div>
      </section>

      <main className="relative -mt-16 z-20">
        {/* Quick Help Cards - Elevated Design */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: MessageCircle, title: "Expert Consult", desc: "Chat with our local travel designers for immediate inspiration." },
              { icon: Phone, title: "24/7 Support", desc: "Our concierge team is available around the clock for our guests." },
              { icon: Mail, title: "Bespoke Request", desc: "Send us your vision and we'll craft a personalized itinerary." }
            ].map((item, i) => (
              <Card key={i} className="border-none shadow-2xl bg-white/95 backdrop-blur-sm hover:translate-y-[-5px] transition-all duration-500">
                <CardContent className="p-8 text-center">
                  <div className="w-14 h-14 bg-accent/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent/10">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-primary mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Content Section */}
        <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-accent mb-4" />
              <p className="text-muted-foreground italic font-serif">Arriving shortly...</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-20">
              <Compass className="h-16 w-16 mx-auto text-accent/20 mb-6" />
              <h3 className="text-2xl font-serif font-bold text-primary mb-2">Tailoring Our Knowledge</h3>
              <p className="text-muted-foreground">Our travel guides are being updated. Please contact us for direct inquiries.</p>
            </div>
          ) : (
            <div className="space-y-20">
              {categories.map((category) => (
                <div key={category} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-accent/30 flex-grow"></div>
                    <h2 className="text-3xl font-serif font-bold text-primary px-4 whitespace-nowrap">
                      {category}
                    </h2>
                    <div className="h-px bg-accent/30 flex-grow"></div>
                  </div>

                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {groupedFaqs[category].map((faq) => (
                      <AccordionItem 
                        key={faq.id} 
                        value={faq.id} 
                        className="border rounded-xl bg-white px-2 overflow-hidden shadow-sm hover:shadow-md transition-shadow border-accent/5"
                      >
                        <AccordionTrigger className="px-4 py-6 text-left hover:no-underline group">
                          <span className="text-lg font-serif font-semibold text-primary group-data-[state=open]:text-accent transition-colors">
                            {faq.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-6">
                          <div className="text-muted-foreground leading-relaxed text-base border-t border-accent/5 pt-4">
                            {faq.answer}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Still Have Questions - Luxury CTA */}
        <section className="py-24 bg-muted/30 border-t border-accent/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-serif font-bold text-primary mb-6 italic">
              Your Journey, Perfectly Crafted
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Didn't find what you were looking for? Our private travel designers are ready to answer any nuance of your upcoming Egyptian odyssey.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="px-10 py-7 text-lg shadow-xl hover:scale-105 transition-transform">
                  Speak to a Consultant
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <NewsletterSection />
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
