import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.json());

const WEBHOOK_VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || 'anvisha_traders_webhook_2026';

// Meta WhatsApp Webhook Verification (GET)
app.get('/api/whatsapp-webhook', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Check if a token and mode is in the query string of the request
  if (mode === 'subscribe' && (token === WEBHOOK_VERIFY_TOKEN || token === 'anvisha_traders_webhook_2026')) {
    console.log('Meta WhatsApp Webhook verified successfully!');
    return res.status(200).send(challenge);
  } else {
    // Responds with '403 Forbidden' if verify tokens do not match
    console.warn('Meta WhatsApp Webhook verification failed. Invalid token.');
    return res.sendStatus(403);
  }
});

// Meta WhatsApp Webhook Event Receiver (POST)
app.post('/api/whatsapp-webhook', (req: Request, res: Response) => {
  const body = req.body;
  if (body.object) {
    // Acknowledge receipt of the event from WhatsApp
    return res.status(200).send('EVENT_RECEIVED');
  }
  return res.sendStatus(404);
});

// Proxy route for Meta WhatsApp Cloud API to bypass browser CORS constraints
app.post('/api/send-whatsapp-otp', async (req: Request, res: Response) => {
  try {
    const { phoneId, token, to, body } = req.body;

    if (!phoneId || !token || !to || !body) {
      return res.status(400).json({ error: 'Missing required fields (phoneId, token, to, body)' });
    }

    const cleanTo = String(to).replace(/[^0-9]/g, '');
    const metaApiUrl = `https://graph.facebook.com/v20.0/${phoneId}/messages`;

    const metaRes = await fetch(metaApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanTo.startsWith('91') ? cleanTo : `91${cleanTo}`,
        type: 'text',
        text: {
          preview_url: false,
          body: body,
        },
      }),
    });

    const metaData = await metaRes.json();
    return res.status(metaRes.status).json(metaData);
  } catch (error: any) {
    console.error('Meta WhatsApp proxy error:', error);
    return res.status(500).json({ error: error?.message || 'Server error' });
  }
});

async function start() {
  // Always serve /public directory files (videos, icons, sounds) with proper MIME types and range streaming
  app.use(express.static(path.resolve('public')));

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

start();
