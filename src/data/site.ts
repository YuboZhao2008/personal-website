// Set this to the public origin at build time. Never guess a production domain.
function configuredOrigin(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  const url = new URL(value);
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "SITE_URL must be an HTTP(S) origin without credentials, a path, query, or fragment.",
    );
  }
  return url.origin;
}
export const site = {
  url: configuredOrigin(process.env.SITE_URL),
  title: "Yubo Zhao — Software Engineering, AI & Intelligent Systems",
  description:
    "University of Waterloo Software Engineering student building systems across AI, machine learning, computer vision, robotics, and intelligent software.",
};
