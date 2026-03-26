import type { Metadata } from "next";

export const siteConfig = {
  name: "SEO Social Master",
  description: "Generate SEO-optimized content for social media platforms with real-time feedback.",
  url: "https://seo-social-master.vercel.app",
  ogImage: "https://seo-social-master.vercel.app/og.png",
  links: {
    github: "https://github.com/content-master",
  },
};

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@seosocialmaster",
    },
    icons: {
      icon: "/favicon.ico",
    },
    metadataBase: new URL(siteConfig.url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
