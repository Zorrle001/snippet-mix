/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        turbo: {
            rules: {
                "*.scoped_scss": {
                    loaders: ["raw-loader", "sass-loader"],
                },
            },
        },
    },
};
export default nextConfig;
