import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertDestinationSchema, attractionSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Loader2, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const destinationFormSchema = insertDestinationSchema.extend({
  heroImage: z.string().min(1, "Hero image is required"),
});

type DestinationFormData = z.infer<typeof destinationFormSchema>;

interface Attraction {
  id: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface DestinationFormProps {
  initialData?: Partial<any>;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function DestinationForm({ initialData, onSubmit, isLoading }: DestinationFormProps) {
  const [attractions, setAttractions] = useState<Attraction[]>(initialData?.attractions || []);
  const [faqs, setFaqs] = useState<FAQ[]>(initialData?.faqs || []);

  const form = useForm<DestinationFormData>({
    resolver: zodResolver(destinationFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      shortDescription: "",
      heroImage: "",
      gallery: [],
      highlights: [],
      attractions: [],
      bestTimeToVisit: "",
      duration: "",
      difficulty: "Easy",
      region: "",
      featured: false,
      published: true,
      seoTitle: "",
      metaDescription: "",
      focusKeyword: "",
      schemaType: "",
      ogImage: "",
      canonicalUrl: "",
      robots: "index,follow",
      schemaMarkup: "",
      faqs: [],
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        form.setValue(key as any, initialData[key]);
      });
      if (initialData.attractions) {
        setAttractions(initialData.attractions);
      }
      if (initialData.faqs) {
        setFaqs(initialData.faqs);
      }
    }
  }, [initialData, form]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);
    if (!initialData?.slug) {
      form.setValue("slug", generateSlug(name));
    }
  };

  // Attraction management
  const addAttraction = () => {
    const newAttraction: Attraction = {
      id: uuidv4(),
      name: "",
      description: "",
      image: "",
      imageAlt: "",
    };
    setAttractions([...attractions, newAttraction]);
  };

  const updateAttraction = (id: string, field: keyof Attraction, value: string) => {
    setAttractions(attractions.map(attr =>
      attr.id === id ? { ...attr, [field]: value } : attr
    ));
  };

  const removeAttraction = (id: string) => {
    setAttractions(attractions.filter(attr => attr.id !== id));
  };

  // FAQ management
  const addFaq = () => {
    setFaqs([...faqs, { id: uuidv4(), question: "", answer: "" }]);
  };

  const updateFaq = (id: string, field: keyof Omit<FAQ, "id">, value: string) => {
    setFaqs(faqs.map(faq => (faq.id === id ? { ...faq, [field]: value } : faq)));
  };

  const removeFaq = (id: string) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
  };

  const handleSubmit = (data: DestinationFormData) => {
    const transformedData = {
      ...data,
      attractions: attractions.filter(attr => attr.name.trim().length > 0),
      highlights: attractions.filter(attr => attr.name.trim().length > 0).map(attr => attr.name),
      gallery: attractions.filter(attr => attr.image.trim().length > 0).map(attr => attr.image),
      faqs: faqs.filter(f => f.question.trim().length > 0 && f.answer.trim().length > 0),
    };
    onSubmit(transformedData);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4" data-testid="tabs-destination-form">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="attractions" data-testid="tab-attractions">Attractions</TabsTrigger>
          <TabsTrigger value="faqs" data-testid="tab-faqs">FAQs</TabsTrigger>
          <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Main details about the destination</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Destination Name *</Label>
                  <Input
                    id="name"
                    data-testid="input-destination-name"
                    {...form.register("name")}
                    onChange={handleNameChange}
                    placeholder="e.g., Cairo"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{String(form.formState.errors.name.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    data-testid="input-destination-slug"
                    {...form.register("slug")}
                    placeholder="cairo"
                  />
                  {form.formState.errors.slug && (
                    <p className="text-sm text-destructive">{String(form.formState.errors.slug.message)}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Region *</Label>
                  <Select
                    value={form.watch("region")}
                    onValueChange={(value) => form.setValue("region", value)}
                  >
                    <SelectTrigger data-testid="select-destination-region">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cairo & Giza">Cairo & Giza</SelectItem>
                      <SelectItem value="Upper Egypt">Upper Egypt</SelectItem>
                      <SelectItem value="Lower Egypt">Lower Egypt</SelectItem>
                      <SelectItem value="Red Sea">Red Sea</SelectItem>
                      <SelectItem value="Sinai">Sinai</SelectItem>
                      <SelectItem value="Western Desert">Western Desert</SelectItem>
                      <SelectItem value="Eastern Desert">Eastern Desert</SelectItem>
                      <SelectItem value="Siwa Oasis">Siwa Oasis</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.region && (
                    <p className="text-sm text-destructive">{String(form.formState.errors.region.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={form.watch("difficulty") || "Easy"}
                    onValueChange={(value) => form.setValue("difficulty", value)}
                  >
                    <SelectTrigger data-testid="select-destination-difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Challenging">Challenging</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Recommended Duration</Label>
                  <Input
                    id="duration"
                    data-testid="input-destination-duration"
                    {...form.register("duration")}
                    placeholder="e.g., 2-3 days"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bestTimeToVisit">Best Time to Visit</Label>
                  <Input
                    id="bestTimeToVisit"
                    data-testid="input-destination-best-time"
                    {...form.register("bestTimeToVisit")}
                    placeholder="e.g., October to April"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description (tagline)</Label>
                <Input
                  id="shortDescription"
                  data-testid="input-destination-short-description"
                  {...form.register("shortDescription")}
                  placeholder="e.g., The City of a Thousand Minarets"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description *</Label>
                <Textarea
                  id="description"
                  data-testid="input-destination-description"
                  {...form.register("description")}
                  placeholder="Detailed destination description..."
                  rows={6}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.description.message)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroImage">Hero Image URL *</Label>
                <Input
                  id="heroImage"
                  data-testid="input-destination-hero-image"
                  {...form.register("heroImage")}
                  placeholder="https://example.com/destination-hero.jpg or /assets/image.jpg"
                />
                {form.formState.errors.heroImage && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.heroImage.message)}</p>
                )}
                {form.watch("heroImage") && (
                  <div className="mt-2">
                    <img
                      src={form.watch("heroImage")}
                      alt="Hero preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attractions Tab */}
        <TabsContent value="attractions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Destination Attractions</CardTitle>
              <CardDescription>Add the key attractions and highlights for this destination. Each attraction needs a name, description, and image.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {attractions.map((attraction, index) => (
                <Card key={attraction.id} className="border-2">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Attraction {index + 1}</CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttraction(attraction.id)}
                        className="text-destructive hover:text-destructive"
                        data-testid={`button-remove-attraction-${index}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Attraction Name *</Label>
                      <Input
                        value={attraction.name}
                        onChange={(e) => updateAttraction(attraction.id, "name", e.target.value)}
                        placeholder="e.g., Bibliotheca Alexandrina"
                        data-testid={`input-attraction-name-${index}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Short Description *</Label>
                      <Textarea
                        value={attraction.description}
                        onChange={(e) => updateAttraction(attraction.id, "description", e.target.value)}
                        placeholder="A brief description of this attraction..."
                        rows={3}
                        data-testid={`input-attraction-description-${index}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Image URL *</Label>
                      <Input
                        value={attraction.image}
                        onChange={(e) => updateAttraction(attraction.id, "image", e.target.value)}
                        placeholder="https://example.com/attraction.jpg or /assets/image.jpg"
                        data-testid={`input-attraction-image-${index}`}
                      />
                      {attraction.image && (
                        <div className="mt-2">
                          <img
                            src={attraction.image}
                            alt={attraction.imageAlt || attraction.name || "Attraction preview"}
                            className="w-full max-w-xs h-32 object-cover rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Image Alt Text</Label>
                      <Input
                        value={attraction.imageAlt || ""}
                        onChange={(e) => updateAttraction(attraction.id, "imageAlt", e.target.value)}
                        placeholder="Describe the image for accessibility and SEO (e.g., Sunset over the Great Pyramid of Giza)"
                        data-testid={`input-attraction-image-alt-${index}`}
                      />
                      <p className="text-xs text-muted-foreground">Used for screen readers and image search ranking. Describe what's in the photo.</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addAttraction}
                className="w-full"
                data-testid="button-add-attraction"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Attraction
              </Button>

              {attractions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No attractions added yet.</p>
                  <p className="text-sm">Click the button above to add attractions for this destination.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Add common questions and answers about this destination. They will appear at the bottom of the destination page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={faq.id} className="border-2">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFaq(faq.id)}
                        className="text-destructive hover:text-destructive"
                        data-testid={`button-remove-faq-${index}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Question *</Label>
                      <Input
                        value={faq.question}
                        onChange={(e) => updateFaq(faq.id, "question", e.target.value)}
                        placeholder="e.g., What is the best time to visit?"
                        data-testid={`input-faq-question-${index}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Answer *</Label>
                      <Textarea
                        value={faq.answer}
                        onChange={(e) => updateFaq(faq.id, "answer", e.target.value)}
                        placeholder="Provide a detailed answer..."
                        rows={4}
                        data-testid={`input-faq-answer-${index}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addFaq}
                className="w-full"
                data-testid="button-add-faq"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ
              </Button>

              {faqs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No FAQs added yet.</p>
                  <p className="text-sm">Click the button above to add a question and answer for this destination.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Optimize how this destination appears in search engines and social shares.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <span className="text-xs text-muted-foreground">
                    {(form.watch("seoTitle") || "").length}/60
                  </span>
                </div>
                <Input
                  id="seoTitle"
                  maxLength={60}
                  {...form.register("seoTitle")}
                  placeholder="e.g., Luxury Cairo Travel Guide | I.LuxuryEgypt"
                  data-testid="input-destination-seo-title"
                />
                <p className="text-xs text-muted-foreground">Used for the &lt;title&gt; tag (max 60 characters).</p>
                {form.formState.errors.seoTitle && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.seoTitle.message)}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <span className="text-xs text-muted-foreground">
                    {(form.watch("metaDescription") || "").length}/160
                  </span>
                </div>
                <Textarea
                  id="metaDescription"
                  maxLength={160}
                  rows={3}
                  {...form.register("metaDescription")}
                  placeholder="A short summary shown in search results and social shares (max 160 characters)."
                  data-testid="input-destination-meta-description"
                />
                {form.formState.errors.metaDescription && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.metaDescription.message)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="focusKeyword">Focus Keyword</Label>
                <Input
                  id="focusKeyword"
                  {...form.register("focusKeyword")}
                  placeholder="e.g., luxury Luxor tour"
                  data-testid="input-destination-focus-keyword"
                />
                <p className="text-xs text-muted-foreground">The main keyword you want this page to rank for. Used as a guideline; not embedded directly in tags.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schemaType">Schema Markup Type</Label>
                  <Select
                    value={form.watch("schemaType") || ""}
                    onValueChange={(value) => form.setValue("schemaType", value)}
                  >
                    <SelectTrigger data-testid="select-destination-schema-type">
                      <SelectValue placeholder="Select schema type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TouristDestination">TouristDestination</SelectItem>
                      <SelectItem value="TouristAttraction">TouristAttraction</SelectItem>
                      <SelectItem value="LandmarksOrHistoricalBuildings">LandmarksOrHistoricalBuildings</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Schema.org @type used for the auto-generated structured data.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="robots">Robots</Label>
                  <Select
                    value={form.watch("robots") || "index,follow"}
                    onValueChange={(value) => form.setValue("robots", value)}
                  >
                    <SelectTrigger data-testid="select-destination-robots">
                      <SelectValue placeholder="Select robots directive" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="index,follow">index, follow</SelectItem>
                      <SelectItem value="noindex,nofollow">noindex, nofollow</SelectItem>
                      <SelectItem value="index,nofollow">index, nofollow</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Tells search engines whether to index this page and follow its links.</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogImage">OG Image URL</Label>
                <Input
                  id="ogImage"
                  {...form.register("ogImage")}
                  placeholder="https://example.com/share-image.jpg"
                  data-testid="input-destination-og-image"
                />
                <p className="text-xs text-muted-foreground">Image used when this page is shared on Facebook, X, LinkedIn, etc. Recommended 1200x630.</p>
                {form.watch("ogImage") && (
                  <div className="mt-2">
                    <img
                      src={form.watch("ogImage") || ""}
                      alt="OG preview"
                      className="w-full max-w-md h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input
                  id="canonicalUrl"
                  {...form.register("canonicalUrl")}
                  placeholder="https://iluxuryegypt.com/destinations/cairo"
                  data-testid="input-destination-canonical-url"
                />
                <p className="text-xs text-muted-foreground">Preferred URL for this content if it appears in multiple places. Leave empty to use the page URL.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schemaMarkup">Custom Schema Markup (JSON-LD, optional)</Label>
                <Textarea
                  id="schemaMarkup"
                  rows={8}
                  className="font-mono text-xs"
                  {...form.register("schemaMarkup")}
                  placeholder='{"@context":"https://schema.org","@type":"TouristDestination","name":"Cairo"}'
                  data-testid="input-destination-schema-markup"
                />
                <p className="text-xs text-muted-foreground">Optional. Paste valid JSON-LD here to override the auto-generated schema above. Embedded in a &lt;script type="application/ld+json"&gt; tag.</p>
                {form.formState.errors.schemaMarkup && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.schemaMarkup.message)}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Destination Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">Featured Destination</Label>
                  <p className="text-sm text-muted-foreground">Show this destination prominently on the website</p>
                </div>
                <Switch
                  id="featured"
                  checked={form.watch("featured")}
                  onCheckedChange={(checked) => form.setValue("featured", checked)}
                  data-testid="switch-destination-featured"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Published</Label>
                  <p className="text-sm text-muted-foreground">Make this destination visible to visitors</p>
                </div>
                <Switch
                  id="published"
                  checked={form.watch("published")}
                  onCheckedChange={(checked) => form.setValue("published", checked)}
                  data-testid="switch-destination-published"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button
          type="submit"
          disabled={isLoading}
          data-testid="button-submit-destination"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Destination" : "Create Destination"}
        </Button>
      </div>
    </form>
  );
}
