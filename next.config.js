/** @type {import('next').NextConfig} */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sassOptions = {
    includePaths: [path.join(__dirname, 'styles')],
};

const nextConfig = {
    output: 'export',
    sassOptions,
};

export default nextConfig;


