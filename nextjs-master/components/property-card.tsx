"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { HeartIcon, Bed, Bath, Square, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toggleFavorite } from "@/lib/supabase";

export interface PropertyProps {
  id: string;
  title: string;
  address: string;
  price: number;
  type: "sale" | "rent";
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  imageUrl: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isFavorite?: boolean;
}

function PropertyCard({
  id,
  title,
  address,
  price,
  type,
  bedrooms,
  bathrooms,
  sqft,
  imageUrl,
  isNew,
  isFeatured,
  isFavorite: isFavoriteProp = false,
}: PropertyProps) {
  const [isFavorite, setIsFavorite] = useState(isFavoriteProp);
  const [loaded, setLoaded] = useState(false); // 👈 loader state
  const router = useRouter();

  const handleFavorite = async () => {
    try {
      const newState = await toggleFavorite(id);
      setIsFavorite(newState);
    } catch (error: any) {
      if (error.message === "redirect") {
        router.push("/login");
      } else {
        console.error("Error toggling favorite:", error);
      }
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative">
        <AspectRatio ratio={4 / 3}>
          {/* Skeleton while loading */}
          {!loaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md" />
          )}
          <Image
            src={imageUrl}
            alt={title}
            fill
            onLoad={() => setLoaded(true)} // 👈 sets loaded true
            className={`object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </AspectRatio>

        <div className="absolute left-2 right-2 top-2 flex justify-between">
          {isNew && <Badge className="bg-accent text-accent-foreground">New</Badge>}
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={handleFavorite}
          >
            <HeartIcon
              className={cn(
                "h-4 w-4",
                isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
              )}
            />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="font-semibold line-clamp-1">{title}</h3>
          {isFeatured && (
            <p className="flex items-center text-yellow-500 text-sm">
              <Star className="mr-1 h-3 w-3 fill-yellow-500" />
              Featured
            </p>
          )}
        </div>

        <p className="mb-2 text-sm text-muted-foreground line-clamp-1">{address}</p>

        <p className="mb-4 text-xl font-bold">
          {typeof price === "number" ? `$${price.toLocaleString()}` : "N/A"}
          {type === "rent" && (
            <span className="text-sm font-normal text-muted-foreground">/mo</span>
          )}
        </p>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{bedrooms != null ? `${bedrooms} ${bedrooms === 1 ? "bed" : "beds"}` : "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{bathrooms != null ? `${bathrooms} ${bathrooms === 1 ? "bath" : "baths"}` : "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{sqft ? `${sqft.toLocaleString()} sq ft` : "N/A"}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/property/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PropertyCard;