/** @type {import('next').NextConfig} */
const [repositoryOwner, repositoryName] = (process.env.GITHUB_REPOSITORY || "").split("/");
const defaultBasePath =
  repositoryName && repositoryName !== `${repositoryOwner}.github.io` ? `/${repositoryName}` : "";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? defaultBasePath;

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "export",
  trailingSlash: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
