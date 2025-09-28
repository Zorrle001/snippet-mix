/** @type {import('next').NextConfig} */
const nextConfig = {
    sassOptions: {
        silenceDeprecations: ["legacy-js-api"],
        includePaths: ["./styles"],
    },
};
export default nextConfig;
