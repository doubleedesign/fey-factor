// vite.config.ts
import { defineConfig } from "file:///mnt/c/Users/leesa/WebstormProjects/fey-factor/app/node_modules/vite/dist/node/index.js";
import react from "file:///mnt/c/Users/leesa/WebstormProjects/fey-factor/app/node_modules/@vitejs/plugin-react/dist/index.mjs";
import relay from "file:///mnt/c/Users/leesa/WebstormProjects/fey-factor/app/node_modules/vite-plugin-relay/dist/plugin.js";
import mdx from "file:///mnt/c/Users/leesa/WebstormProjects/fey-factor/app/node_modules/@mdx-js/rollup/index.js";
import remarkGfm from "file:///mnt/c/Users/leesa/WebstormProjects/fey-factor/app/node_modules/remark-gfm/index.js";
var vite_config_default = defineConfig({
  plugins: [
    // Wrap the MDX plugin with enforce property
    {
      ...mdx({
        remarkPlugins: [remarkGfm]
      }),
      enforce: "pre"
      // Ensure MDX processing happens first
    },
    react(),
    relay
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".md", ".mdx"]
    // Add MD and MDX file support
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L2MvVXNlcnMvbGVlc2EvV2Vic3Rvcm1Qcm9qZWN0cy9mZXktZmFjdG9yL2FwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL21udC9jL1VzZXJzL2xlZXNhL1dlYnN0b3JtUHJvamVjdHMvZmV5LWZhY3Rvci9hcHAvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL21udC9jL1VzZXJzL2xlZXNhL1dlYnN0b3JtUHJvamVjdHMvZmV5LWZhY3Rvci9hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcmVsYXkgZnJvbSAndml0ZS1wbHVnaW4tcmVsYXknO1xuaW1wb3J0IG1keCBmcm9tICdAbWR4LWpzL3JvbGx1cCc7XG5pbXBvcnQgcmVtYXJrR2ZtIGZyb20gJ3JlbWFyay1nZm0nO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcblx0cGx1Z2luczogW1xuXHRcdC8vIFdyYXAgdGhlIE1EWCBwbHVnaW4gd2l0aCBlbmZvcmNlIHByb3BlcnR5XG5cdFx0e1xuXHRcdFx0Li4ubWR4KHtcblx0XHRcdFx0cmVtYXJrUGx1Z2luczogW3JlbWFya0dmbV0sXG5cdFx0XHR9KSxcblx0XHRcdGVuZm9yY2U6ICdwcmUnLCAvLyBFbnN1cmUgTURYIHByb2Nlc3NpbmcgaGFwcGVucyBmaXJzdFxuXHRcdH0sXG5cdFx0cmVhY3QoKSxcblx0XHRyZWxheSxcblx0XSxcblx0cmVzb2x2ZToge1xuXHRcdGV4dGVuc2lvbnM6IFsnLmpzJywgJy5qc3gnLCAnLnRzJywgJy50c3gnLCAnLm1kJywgJy5tZHgnXSwgLy8gQWRkIE1EIGFuZCBNRFggZmlsZSBzdXBwb3J0XG5cdH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd1UsU0FBUyxvQkFBb0I7QUFDclcsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sV0FBVztBQUNsQixPQUFPLFNBQVM7QUFDaEIsT0FBTyxlQUFlO0FBR3RCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzNCLFNBQVM7QUFBQTtBQUFBLElBRVI7QUFBQSxNQUNDLEdBQUcsSUFBSTtBQUFBLFFBQ04sZUFBZSxDQUFDLFNBQVM7QUFBQSxNQUMxQixDQUFDO0FBQUEsTUFDRCxTQUFTO0FBQUE7QUFBQSxJQUNWO0FBQUEsSUFDQSxNQUFNO0FBQUEsSUFDTjtBQUFBLEVBQ0Q7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNSLFlBQVksQ0FBQyxPQUFPLFFBQVEsT0FBTyxRQUFRLE9BQU8sTUFBTTtBQUFBO0FBQUEsRUFDekQ7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
