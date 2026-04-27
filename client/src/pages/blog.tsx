import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Clock, Calendar, ArrowRight, Search, Tag } from "lucide-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Helmet } from "react-helmet-async";

const categories = [
  'All Posts',
  'Culture & History',
  'Travel Tips',
  'Destinations',
  'Food & Culture',
  'Travel Planning',
  'Responsible Travel'
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All Posts');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: postsResponse, isLoading } = useQuery({
    queryKey: ["/api/blog/posts"],
  });

  const blogPosts = (postsResponse as any)?.posts || [];

  const filteredPosts = blogPosts.filter((post: any) => {
    const matchesCategory = selectedCategory === 'All Posts' || post.category === selectedCategory;
    const matchesSearch = post.titleEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* --- SEO Metadata Section --- */}
      <Helmet>
        <title>Egypt Luxury Travel Blog | Expert Insights & Guides | iLuxury Egypt</title>
        <meta name="description" content="Discover the secrets of Egypt through our luxury travel blog. From Nile cruise guides to hidden oasis gems and culinary journeys." />
        <meta property="og:title" content="iLuxury Egypt Blog - Tales from the Land of Pharaohs" />
        <meta property="og:description" content="Expert travel tips, cultural insights, and luxury destination guides for your next Egyptian adventure." />
        <meta name="keywords" content="Egypt Travel Blog, Luxury Egypt Guides, Nile Cruise Tips, Egyptian Culture, Travel Planning Egypt, Hidden Gems Egypt" />
      </Helmet>
      {/* ---------------------------- */}

      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-background via-accent/5 to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-6">
            Travel Stories & Insights
          </h1>
          <div className="w-32 h-px bg-accent mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover Egypt through the eyes of our travel experts. From ancient mysteries to modern luxury, 
            explore stories that inspire and guide your perfect Egyptian adventure.
          </p>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-12 bg-background border-b border-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Search Input */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-accent/20 focus:border-accent"
              />
            </div>

            {/* Categories Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                  className="rounded-full px-6 transition-all duration-300"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Results Summary */}
          {!isLoading && (
            <p className="text-center md:text-left text-sm text-muted-foreground mt-8 animate-in fade-in duration-500">
              Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
              {selectedCategory !== 'All Posts' && ` in "${selectedCategory}"`}
            </p>
          )}
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {isLoading ? (
            <div className="text-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground font-serif italic">Curating stories for you...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredPosts.map((post: any) => (
                <Card key={post.id} className="group flex flex-col h-full overflow-hidden hover:shadow-2xl transition-all duration-500 border-none bg-muted/30" data-testid={`blog-post-${post.slug}`}>
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={post.featuredImage || 'https://images.unsplash.com/photo-1539650116574-75c0c6d04136?q=80&w=2070&auto=format&fit=crop'}
                      alt={post.titleEn}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-accent/90 backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 font-medium uppercase tracking-tighter">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-serif font-bold text-primary mb-4 line-clamp-2 group-hover:text-accent transition-colors duration-300" data-testid={`text-title-${post.slug}`}>
                      {post.titleEn}
                    </h3>

                    <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3 text-sm" data-testid={`text-excerpt-${post.slug}`}>
                      {post.excerpt || 'Embark on a journey to discover the unparalleled beauty and heritage of Egypt through our curated insights.'}
                    </p>

                    <div className="mt-auto pt-6 border-t border-accent/10 flex items-center justify-between">
                      <Link href={`/blog/${post.slug}`}>
                        <a className="text-accent text-sm font-bold flex items-center group/link">
                          Read Full Story
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-2" />
                        </a>
                      </Link>
                      <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">
                        {post.readTime || '5 min read'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Results State */}
          {!isLoading && filteredPosts.length === 0 && (
            <div className="text-center py-24 bg-muted/20 rounded-3xl border border-dashed border-accent/20">
              <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-6" />
              <h3 className="text-2xl font-serif font-bold text-primary mb-2">No Stories Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                We couldn't find any articles matching your criteria. Try exploring another category or search term.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All Posts');
                }}
              >
                View All Stories
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter / CTA Section */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/pyramid.png')]"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 italic">
            Stay Inspired
          </h2>
          <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
          <p className="text-xl text-white/80 mb-10 leading-relaxed font-light">
            Subscribe to receive exclusive destination guides, luxury travel trends, 
            and curated Egyptian experiences directly in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-bold px-10" asChild>
              <Link href="/contact">Subscribe Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="/destinations">Explore Destinations</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
