import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function emailApiPlugin(): Plugin {
  return {
    name: 'email-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/send-email', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let bodyStr = '';
        req.on('data', (chunk) => {
          bodyStr += chunk;
        });
        req.on('end', async () => {
          try {
            const { to, subject, html, text, apiKey, attachments, from } = JSON.parse(bodyStr || '{}');
            const key = apiKey || process.env.RESEND_API_KEY;

            if (!key) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: false,
                  simulated: true,
                  message: 'No Resend API Key configured. Please add one in Mailer Settings or use Mailto / Copy HTML.',
                })
              );
              return;
            }

            const sendPayload: Record<string, unknown> = {
              from: from || process.env.RESEND_FROM_EMAIL || 'Precious & Ugochukwu <onboarding@resend.dev>',
              to: [to],
              subject,
              html,
              text,
            };

            if (attachments && Array.isArray(attachments) && attachments.length > 0) {
              sendPayload.attachments = attachments;
            }

            const response = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${key}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(sendPayload),
            });

            const resData = (await response.json().catch(() => ({}))) as { message?: string; id?: string };
            if (!response.ok) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: false,
                  error: resData.message || 'Resend API returned error',
                })
              );
              return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                message: 'Email delivered via Resend',
                id: resData.id,
              })
            );
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: msg }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), emailApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
