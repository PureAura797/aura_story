import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Главная",
        "item": "https://pureaura.ru/"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        ...(item.href ? { "item": `https://pureaura.ru${item.href}` } : {})
      }))
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <nav aria-label="Breadcrumb" className="w-full flex items-center text-[13px] text-neutral-400 mb-8 pt-32 px-6 max-w-[1200px] mx-auto z-20 relative">
        <ol className="flex items-center gap-2 flex-wrap">
          <li className="flex items-center">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5" aria-label="Главная">
              <Home className="w-3.5 h-3.5" />
              <span className="sr-only md:not-sr-only">Главная</span>
            </Link>
          </li>
          
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <li key={index} className="flex items-center gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
                {isLast || !item.href ? (
                  <span className="text-white font-medium" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
